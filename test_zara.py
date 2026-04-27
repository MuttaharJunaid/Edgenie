"""
Standalone Zara chatbot test — no Django, no database needed.
Run from the project root:
    python test_zara.py

Set your Gemini API key first:
    $env:CHATBOT_GEMINI_KEY = "your_key_here"   (PowerShell)
    set CHATBOT_GEMINI_KEY=your_key_here         (CMD)
"""
import os
import sys

# Add project root to path so ai.* imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ── Check API key ─────────────────────────────────────────────────────────────
api_key = os.environ.get('CHATBOT_GEMINI_KEY', '')
if not api_key:
    print("\n❌  CHATBOT_GEMINI_KEY is not set.")
    print("    Run this first (PowerShell):")
    print('    $env:CHATBOT_GEMINI_KEY = "your_gemini_api_key_here"')
    print("    Then run: python test_zara.py\n")
    sys.exit(1)

print("✅  API key found.")
print("⏳  Loading knowledge index (first run downloads the embedding model ~90MB)...\n")

from ai.chatbot.zara_service import ZaraService

service = ZaraService()

if not service._index.is_ready:
    print("⚠️  Knowledge index failed to load — check logs above.")
    print("    Zara will still respond but without RAG context.\n")
else:
    print(f"✅  Knowledge index ready.\n")

# ── Interactive chat loop ─────────────────────────────────────────────────────
print("=" * 60)
print("  ZARA — O-Level AI Tutor  (type 'quit' to exit)")
print("=" * 60)

SUBJECTS = [
    "Mathematics", "Physics", "English Language",
    "Business Studies", "Principles of Accounts", "Chemistry"
]

print("\nSubjects:", ", ".join(SUBJECTS))
subject = input("Choose a subject (or press Enter to skip): ").strip() or None
if subject and subject not in SUBJECTS:
    print(f"  '{subject}' not recognised — proceeding without subject filter.")
    subject = None

print(f"\nSubject: {subject or 'None (general)'}")
print("Start chatting! Zara will remember the conversation.\n")

history = []

while True:
    try:
        user_input = input("You: ").strip()
    except (EOFError, KeyboardInterrupt):
        print("\n\nGoodbye!")
        break

    if not user_input:
        continue
    if user_input.lower() in ('quit', 'exit', 'q'):
        print("Goodbye!")
        break

    print("Zara: ", end="", flush=True)

    result = service.respond(
        message=user_input,
        history=history,
        subject=subject,
    )

    reply = result.get("reply", "No response.")
    print(reply)
    print()

    # Update history for next turn
    history.append({"role": "user",      "content": user_input})
    history.append({"role": "assistant", "content": reply})
