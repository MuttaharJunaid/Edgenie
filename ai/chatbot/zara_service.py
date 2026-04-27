"""
Zara — O-Level AI Tutor Service.

Stateless RAG chatbot for the Edgenie mobile app.
Uses the same google.genai (new SDK) client as EdgenieChatbot.

Flow per request:
  1. Retrieve top-6 relevant Q&A pairs from the knowledge index
     (filtered by subject if provided)
  2. Inject them into the system prompt dynamically
  3. Build contents array from history + current message
  4. Call Gemini and return { reply: str }

History is passed in from the mobile app on every call — nothing
is read from or written to the database in this service.
"""
import logging
from google.genai import types

from ai.shared.gemini_client import get_new_genai_client
from ai.chatbot.zara_knowledge_loader import get_zara_index

logger = logging.getLogger('edgenie.ai.chatbot.zara')

# ── System prompt (verbatim from spec) ────────────────────────────────────────
ZARA_SYSTEM_INSTRUCTION = """You are Zara, an O-Level academic tutor assistant. You help students aged 14–18 with Mathematics, Physics, English Language, Business Studies, Principles of Accounts, and Chemistry. You are warm, patient, and encouraging. You explain concepts in simple language, always show step-by-step working for problems, and use analogies to make ideas stick. You never give a bare answer without an explanation. If a student asks about anything outside these six subjects, kindly tell them you can only help with O-Level academics and invite them to ask a subject question. Keep your answers concise and mobile-friendly — avoid walls of text. Use the reference material provided to you to answer accurately. If the answer is not in the reference material, reason carefully from your own knowledge but stay within O-Level scope.

IMPORTANT — when a student asks you to explain further, go deeper, explain again, or says they don't understand: provide a fuller, more detailed explanation. Use a different analogy, break the concept into smaller steps, and address specifically what might be confusing. Do not repeat the same explanation — approach it from a new angle. There is no length limit when a student explicitly asks for more depth."""

ZARA_MODEL = 'gemini-2.5-flash'


class ZaraService:
    """
    Stateless Zara tutor service.

    Usage:
        service = ZaraService()
        result = service.respond(
            message="Why does current split in a parallel circuit?",
            history=[{"role": "user", "content": "..."}, ...],
            subject="Physics",
            chat_id="abc-123",
        )
        # result == { "reply": "..." }
    """

    def __init__(self):
        self._client = get_new_genai_client()
        self._index = get_zara_index()

    def respond(
        self,
        message: str,
        history: list[dict],
        subject: str | None = None,
        chat_id: str | None = None,
    ) -> dict:
        """
        Generate Zara's response.

        Args:
            message:  Student's current message.
            history:  Prior turns [{role: user|assistant, content: str}].
                      Sent from the mobile app; last 10 turns are used.
            subject:  Optional subject name for RAG filtering.
            chat_id:  Ignored here (stateless) — kept for API symmetry.

        Returns:
            { "reply": str }
        """
        if not message or not message.strip():
            return {'reply': 'Please type your question and I\'ll help you out! 😊'}

        try:
            # Step 1: RAG retrieval
            rag_pairs = self._retrieve(message, subject)

            # Step 2: Build dynamic system instruction
            system_instruction = self._build_system_instruction(rag_pairs)

            # Step 3: Build contents (history + current message)
            contents = self._build_contents(message, history)

            # Step 4: Call Gemini
            response = self._client.models.generate_content(
                model=ZARA_MODEL,
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.5,
                    max_output_tokens=800,
                ),
            )

            reply = response.text or 'I couldn\'t generate a response. Please try again.'
            return {'reply': reply}

        except Exception as e:
            logger.error(f'ZaraService.respond error: {e}')
            return {
                'reply': (
                    'I\'m having a little trouble right now. '
                    'Give me a moment and try again! 😊'
                )
            }

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _retrieve(
        self, message: str, subject: str | None
    ) -> list[dict]:
        if not self._index.is_ready:
            logger.warning('Zara: knowledge index not ready, responding without RAG.')
            return []
        return self._index.retrieve(message, subject=subject, k=6)

    def _build_system_instruction(self, rag_pairs: list[dict]) -> str:
        instruction = ZARA_SYSTEM_INSTRUCTION

        # Only inject pairs with meaningful relevance (cosine > 0.20)
        relevant = [p for p in rag_pairs if p.get('score', 0) > 0.20]

        if not relevant:
            return instruction

        knowledge_block = '\n\n---\nREFERENCE MATERIAL (use this to answer accurately):\n'
        for i, pair in enumerate(relevant, 1):
            knowledge_block += (
                f'\n[{i}] Q: {pair["question"]}\n'
                f'    A: {pair["answer"]}\n'
            )
        knowledge_block += '---\n'

        return instruction + knowledge_block

    def _build_contents(
        self, message: str, history: list[dict]
    ) -> list[dict]:
        contents = []

        # Add last 10 turns from history
        for turn in history[-10:]:
            role = turn.get('role', 'user')
            content = turn.get('content', '')
            if not content:
                continue
            gemini_role = 'model' if role == 'assistant' else 'user'
            contents.append({
                'role': gemini_role,
                'parts': [{'text': content}],
            })

        # Current message
        contents.append({
            'role': 'user',
            'parts': [{'text': message.strip()}],
        })

        return contents
