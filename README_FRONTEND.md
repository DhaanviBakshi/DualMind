# DUALMIND — SYSTEM 1: FRONTEND & UI

> **Tagline:** "Teach to Learn. Learn to Teach."  
> *"Don't just ask AI for answers. Prove that you understand them."*

Welcome to **System 1 (Frontend & UI)** of the **DUALMIND** AI-powered active-learning EdTech platform. System 1 provides the user-facing responsive web application, interactive Feynman teaching studio, design tokens, and typed integration gateways connecting to the **System 2 AI Learning Engine** and **System 3 Backend & Database**.

---

## 1. System 1 Boundaries & Architecture

System 1 owns the presentation, interactive workflows, and client state:
- `src/app/(marketing)/` — Public landing page, educational philosophy, Feynman loop breakdown, comparison matrix, FAQ.
- `src/app/(auth)/` — Authentication UI (Login, Signup, 4-step Onboarding).
- `src/app/(app)/` — Application shell, sidebar, mobile navigation, and all 13 core student views.
- `src/components/ui/` — Accessible design system primitives (Button, Card, Badge, Slider, Progress, Modal, Tabs, Switch, Avatar, etc.).
- `src/components/layout/` — AppShell, Desktop Sidebar, Header, MobileNav, DemoModeBanner.
- `src/lib/api-client.ts` — Typed integration client with development mock adapter and strict error handling.
- `src/types/dualmind.ts` — TypeScript contracts coordinated with Systems 2 & 3.

---

## 2. Complete 17 Page Implementations

| # | Route | Page Name | Primary Features |
|---|-------|-----------|------------------|
| 1 | `/` | **Landing Page** | Hero ("Teach to Learn. Learn to Teach."), problem analysis, Feynman 4-stage loop, live session preview, comparison matrix (DualMind vs ChatGPT), impact, FAQ |
| 2 | `/login` | **Login** | Email/password sign-in, redirect to dashboard |
| 3 | `/signup` | **Signup** | Account creation, routing to onboarding |
| 4 | `/onboarding` | **Onboarding** | 4-step personalization: Discipline, Mastery Level, AI Sparring Persona, Daily Commitment Goal |
| 5 | `/dashboard` | **Dashboard** | Overall mastery, 14-day streak, study time, topics mastered, critical knowledge gaps alert, weekly mastery sparkline, recent sessions, revision queue |
| 6 | `/learn` | **Curriculum Catalog** | Disciplinary browser (ML, Distributed Systems, Quantum, Neuroscience, Data Structures), search, difficulty filters, mastery progress |
| 7 | `/teach` | **Teach Mode Studio** | **Full 8-stage active learning workflow:** Select subject/topic → Difficulty & Confidence slider (0-100) → Explain concept (Text + Web Speech API voice dictation) → Cognitive evaluation spinner → 4D Rubric scorecards → AI Teacher gap repair & Socratic counter-question → Adaptive mini-quiz → Final verified mastery delta |
| 8 | `/teach/feedback` | **AI Teacher Feedback** | Detailed rubric audit (Accuracy, Completeness, Clarity, Understanding), citation transcript analysis, export to notes |
| 9 | `/quiz` | **Adaptive Quiz** | Dynamic difficulty questions, radio options, instant conceptual explanations, mastery score delta |
| 10 | `/knowledge-map` | **Knowledge Map** | Interactive concept dependency graph, prerequisite links, status color coding (mastered, in-progress, gap, locked), details inspection drawer |
| 11 | `/notes` | **Active Notes** | 3-point Feynman decomposition (Simple Analogy, Core Definition, Common Pitfall), markdown preview, Add Note modal |
| 12 | `/study-plan` | **Study Plan** | Weekly target pacing, milestone completion tracker, daily tasks checklist (Teach, Revision, Deep Quiz, Review Gap) |
| 13 | `/revision` | **Revision** | SM-2 spaced repetition queue, flip card, Leitner intervals (Again <10m, Hard 2d, Good 4d, Easy 7d) |
| 14 | `/analytics` | **Analytics** | Mastery trajectory curve, 4D cognitive radar comparison, subject time distribution, misconception remediation stats |
| 15 | `/achievements` | **Achievements** | Badges for active learning ("Feynman Apprentice", "Misconception Slayer", "14-Day Streak", "Vocal Explainer", etc.) |
| 16 | `/profile` | **Profile** | User learning bio, streak statistics, certificate of Feynman mastery credential download |
| 17 | `/settings` | **Settings** | **System 1 Integration Hub**: Mock vs Live API toggle, custom API Base URL input, connection tester, AI persona selection, voice dictation toggle |

---

## 3. Technology Stack & Design System

- **Framework**: Next.js App Router (14+)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS with custom design tokens defined in `src/app/globals.css` and `tailwind.config.ts`:
  - **Background**: Warm off-white (`hsl(40 20% 98%)` / `#FAF8F5`)
  - **Text**: Deep navy (`hsl(222 47% 11%)` / `#0F172A`)
  - **Primary**: Restrained indigo (`hsl(238 65% 56%)` / `#4F46E5`)
  - **Dark Mode**: Sleek midnight navy theme with subtle indigo luminescence
  - **Accents & States**: Emerald for verified mastery, Amber for detected knowledge gaps, Rose for misconception warnings
- **Icons**: Lucide React
- **Voice Hardware**: Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) with live audio waveform animation and graceful fallback to text input when unsupported or denied.

---

## 4. Integration Contracts & API Assumptions

All API communications are orchestrated through `src/lib/api-client.ts` using types from `src/types/dualmind.ts`.

### Configurable Base URL & Mock Adapter
- **Mock Mode**: Controlled by `NEXT_PUBLIC_USE_MOCK_API` (or toggled at runtime via the persistent top banner / Settings page).
- **Base URL**: Defaults to `NEXT_PUBLIC_API_URL` or `/api`. Can be customized in runtime settings (e.g., `http://localhost:8000`).
- **Strict Error Handling**: In live mode, network failures or backend error codes throw typed `DualMindApiError` exceptions and render clean error notices. System 1 **never pretends that a real API call succeeded when it failed**.

### Endpoints Contract
```http
GET  /api/dashboard
GET  /api/topics
POST /api/sessions
GET  /api/sessions/:id
POST /api/sessions/:id/explanation
POST /api/sessions/:id/evaluate
POST /api/sessions/:id/next-question
POST /api/quizzes
POST /api/quizzes/:id/attempt
GET  /api/progress
GET  /api/knowledge-map
GET  /api/notes
POST /api/notes
GET  /api/recommendations
POST /api/study-plans
GET  /api/analytics
```

### Evaluation Result Contract (Agreed with Systems 2 & 3)
```typescript
export interface EvaluationResult {
  score: number;                         // Overall score (0-100)
  accuracy: number;                      // Scientific correctness (0-100)
  completeness: number;                  // Syllabus coverage (0-100)
  clarity: number;                       // Plain language & analogy quality (0-100)
  understanding: number;                // Genuine conceptual grasp vs rote (0-100)
  strengths: string[];                   // Verified conceptual highlights
  knowledgeGaps: string[];               // Topics omitted or vaguely explained
  misconceptions: string[];              // False assumptions flagged for repair
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  feedback: string;                      // AI Teacher qualitative feedback
  nextQuestion: string;                  // Socratic probing follow-up challenge
}
```

---

## 5. Dependencies to Merge into Root package.json

```json
{
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.11.17",
    "lucide-react": "^0.460.0",
    "next": "^14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.2",
    "recharts": "^2.13.3",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.17.6",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3"
  }
}
```

---

## 6. How to Run the Application

1. **Install Dependencies** (if not already installed):
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. **Test Modes**:
   - To use the built-in development mock adapter: toggle from the top banner or visit `/settings`.
   - To connect to a live backend (System 3): set `NEXT_PUBLIC_USE_MOCK_API=false` in `.env.local` or enter your backend URL in `/settings`.
