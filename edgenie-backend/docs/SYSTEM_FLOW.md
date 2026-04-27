# Edgenie System Architecture & Flow Documentation

This document provides a comprehensive overview of the Edgenie platform, including the backend architecture and the functional flows for each of the three frontends.

---

## 1. Backend Architecture (Django)

The backend is built with a modular Django architecture, optimized for scalability and AI-heavy workloads.

### Modular structure
- **`apps.accounts`**: Handles JWT authentication, user profiles, AI credit management, and student streaks.
- **`apps.papers`**: Manages the academic hierarchy: Subjects -> Papers -> Questions.
- **`apps.search`**: Implements topical search and manages user search history.
- **`apps.submissions`**: Handles question submissions, mock exam sessions, and async grading via Celery.
- **`apps.chat`**: Manages AI tutor sessions and multi-turn conversations.
- **`apps.scraper`**: Admin-only pipeline for automated paper downloading and AI classification.
- **`apps.analytics`**: Aggregates student performance data and global admin KPIs.
- **`apps.landing`**: Simple endpoints for the waitlist and contact forms.

### AI Engine Integration
- **Model A (Gemini 2.0 Pro)**: Used for tutoring, complex concept explanation, and high-accuracy paper extraction.
- **Model B (DistilBERT/T5)**: Lightweight models used for rapid topical classification and initial OCR cleanup.

---

## 2. Mobile App Flow (Expo Router)

The mobile app is the primary interface for students.

### Page Flows:
1. **`app/index.tsx` (Hero/Gateway)**:
   - **Flow**: User lands here -> Clicks "Get Started" -> Redirects to `login.tsx`.
2. **`app/login.tsx` & `app/register.tsx`**:
   - **Flow**: User enters credentials -> Authenticates with `/api/auth/login/` -> Token saved to AsyncStorage -> Redirects to `dashboard.tsx`.
3. **`app/dashboard.tsx` (Home)**:
   - **Flow**: Fetches student overview from `/api/analytics/overview/`.
   - **Button: "Start Practice"**: Redirects to `search-start.tsx`.
   - **Button: "Continue studying Biology"**: Resumes last session or redirects to `search-chat.tsx`.
4. **`app/search-start.tsx`**:
   - **Flow**: User searches for a topic -> Navigates to `search-results.tsx` or `search-chat.tsx` for AI assistance.
5. **`app/search-chat.tsx` (AI Tutor)**:
   - **Flow**: Integrated chat via `/api/chat/send/`.
   - **Button: "Send"**: Sends prompt to AI -> Displays streaming-style response -> Credits consumed via backend.
6. **`app/question.tsx` (Practice Mode)**:
   - **Flow**: Displays specific past paper question.
   - **Button: "Submit"**: Calls `/api/submit-answer/` -> Triggers async Celery grading -> Navigates to `feedback.tsx` once graded.
7. **`app/profile.tsx`**:
   - **Button: "Upgrade to Pro"**: Redirects to `subscription.tsx`.
8. **`app/subscription.tsx`**:
   - **Flow**: Fetches plans -> **Button: "Upgrade"** -> Calls Stripe Checkout via `/api/auth/billing/checkout/`.

---

## 3. Admin Dashboard Flow (React + Vite)

The central command for the Edgenie engine.

### Page Flows:
1. **Dashboard Overview**:
   - **Real-time Stats**: Fetches from `/api/analytics/admin-stats/`.
   - **Flow**: Displays active student count, AI accuracy, and scraper node health.
2. **Scraper Page**:
   - **Flow**: Configures search criteria (Year, Subject, Paper).
   - **Button: "Scrape & Classify"**: Calls `/api/admin-tools/scrape/` -> Launches Celery workers -> Periodically polls `/api/admin-tools/scrape/jobs/` for status updates.

---

## 4. Landing Page Flow (React + Vite)

SEO-optimized marketing site for new users.

### Page Flows:
1. **HomePage**:
   - **Hero Section**: "Study smarter. Ace every exam."
   - **Button: "Get Started Free"**: Redirects to Mobile App download or Registration.
   - **Waitlist Form**: Calls `/api/landing/waitlist/` to capture leads.

---

## 5. Deployment & Security

- **Containerization**: Full Docker setup with separate services for `web`, `celery`, `redis`, `postgres`, and `nginx`.
- **Throttling**: AI endpoints are rate-limited (`AIRateThrottle`) to prevent cost overruns.
- **Monitoring**: Celery tasks are tracked via the `ScrapeJob` and `Submission` models with UUIDs.
