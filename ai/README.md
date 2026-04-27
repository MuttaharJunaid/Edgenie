# Edgenie AI Services

Standalone AI modules. Imported by edgenie-backend.

## Structure
- `chatbot/`     — Gemini chatbot (gemini_chatbot.py)
- `classification/` — PDF → Gemini → DistilBERT pipeline
- `grading/`     — Gemini answer grading
- `search/`      — Gemini search + FAISS RAG + JSON fallback
- `shared/`      — Gemini clients, utils

## Setup
1. Copy classification model to `/app/classification_model/output4/`
2. Copy JSON data files to `/app/data/`
3. Set env vars (see `.env.example`)

## Build FAISS index
```bash
python manage.py build_embeddings
```

## Run standalone chatbot (original script behavior)
```python
from ai.chatbot.gemini_chatbot import process_file_with_gemini
result = process_file_with_gemini('paper.pdf', 'your question')
print(result)
```

## Architecture

```
ai/
├── shared/           ← Shared Gemini clients & utils
│   ├── gemini_client.py   (old SDK + new SDK factories)
│   └── utils.py           (JSON cleaning, safe parsing)
│
├── chatbot/          ← AI Tutor Chat
│   ├── prompts.py         (system instructions)
│   └── gemini_chatbot.py  (EdgenieChatbot class)
│
├── classification/   ← PDF Processing Pipeline
│   ├── prompts.py         (extraction prompt)
│   ├── model_loader.py    (singleton DistilBERT loader)
│   └── classification_model.py (full pipeline + Django integration)
│
├── grading/          ← Answer Grading
│   ├── prompts.py         (grading + feedback prompts)
│   └── grading_service.py (GradingService class)
│
└── search/           ← Question Search
    ├── gemini_search.py   (query understanding)
    ├── rag_pipeline.py    (FAISS semantic search)
    └── json_fallback.py   (JSON file fallback)
```
