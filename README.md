# Edgenie.io - AI-Powered Academic Engine

Edgenie is a next-generation study platform that transforms academic performance through AI-driven past paper extraction, topical classification, and personalized tutoring.

## 🚀 Repository Structure

The project is split into four main components:

- **`edgenie-backend/`**: A production-grade Django backend serving mobile, web, and admin interfaces.
- **`mobile-app/`**: An Expo-based mobile application for students, featuring AI-assisted search and practice.
- **`admin-dashboard/`**: A React-based command center for administrators to manage AI scrapers and system health.
- **`landing-page/`**: A marketing site for user acquisition and product showcase.

---

## 🛠️ Tech Stack & Features

- **Backend**: Django REST Framework, PostgreSQL, Redis, Celery (Async Processing).
- **Frontend (Mobile)**: React Native (Expo), Lucide Icons, Reanimated.
- **Frontend (Web)**: React, Vite, Recharts (Analytics), Vanilla CSS.
- **AI Integration**: Gemini 2.0 Pro (Extraction), DistilBERT (Classification).
- **Billing**: Stripe Checkout & Webhooks.

---

## 📂 Backend File Structure

```text
edgenie-backend/
├── apps/
│   ├── accounts/     # Auth, AI Credits, Streaks
│   ├── papers/       # Subjects, Papers, Question Bank
│   ├── search/       # Topological search engine
│   ├── submissions/  # AI Grading & Feedback
│   ├── chat/         # AI Tutor Sessions
│   ├── scraper/      # Automated Extraction Pipeline
│   ├── core/         # Shared permissions, throttles, mixins
│   └── landing/      # Landing page form handlers
├── edgenie/          # Core Django settings & URLs
├── scripts/          # Docker entrypoints & seeding
└── nginx/            # Reverse proxy configurations
```

---

## 🔄 System Flow & Logic

Detailed page-by-page and button-by-button flows are documented in:
👉 **[SYSTEM_FLOW.md](./docs/SYSTEM_FLOW.md)**

---

## 🏗️ Getting Started (Backend)

1. **Environment Config**: Create a `.env` file based on `.env.example`.
2. **Build with Docker**:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build
   ```
3. **Seed Database**:
   ```bash
   docker exec -it edgenie_web python manage.py loaddata initial_data.json
   ```

## 🧪 Testing

Run the full production-grade test suite:
```bash
pytest
```
Coverage includes Accounts, Papers, Search, AI Chat, Scraper, and Analytics protection.
