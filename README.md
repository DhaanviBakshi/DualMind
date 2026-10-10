DUALMIND — SYSTEM 1: FRONTEND & UI

You are responsible for building the complete frontend and design system for DUALMIND, an AI-powered active-learning EdTech platform.

Tagline: "Teach to Learn. Learn to Teach."

1. Your responsibility

Build the user-facing application. Your work must integrate with the AI learning engine from System 2 and backend from System 3.

Do not independently implement a competing backend, AI service, database schema, or authentication system.

2. Technology stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts
- Framer Motion only where useful
- React Hook Form and Zod where needed

3. Design direction

Create a polished, premium EdTech startup interface.

Use:

- Clean typography and generous spacing
- Professional light and dark themes
- Accessible color contrast
- Responsive desktop, tablet, and mobile layouts
- A desktop sidebar and mobile bottom navigation
- Consistent cards, buttons, forms, dialogs, and progress indicators
- Meaningful empty, loading, success, and error states

Avoid generic neon AI designs, excessive gradients, unnecessary animations, and college-project styling.

Suggested design direction: warm off-white backgrounds, deep navy text, restrained indigo accents, subtle borders, and a clear visual hierarchy. Define all colors as reusable design tokens.

4. Required pages

Implement:

1. Landing page
2. Login
3. Signup
4. Onboarding
5. Dashboard
6. Learn
7. Teach Mode interface
8. AI Teacher feedback interface
9. Adaptive quiz
10. Knowledge map
11. Notes
12. Study plan
13. Revision
14. Analytics
15. Achievements
16. Profile
17. Settings

Create a shared application shell and reusable components rather than duplicating layouts.

5. Landing page

Hero:
DUALMIND
Teach to Learn. Learn to Teach.

"Don't just ask AI for answers. Prove that you understand them."

Buttons:

- Start Learning
- See How It Works

Include problem, solution, learning loop, features, comparison with generic AI tools, example session, impact, and FAQ sections.

6. Dashboard

Create components for:

- Overall mastery
- Learning streak
- Study time
- Topics mastered
- Knowledge gaps
- Recent learning sessions
- Recommended topics
- Today's revision
- Study plan
- Mastery charts

Use realistic example data only in a clearly identified demo mode. Normal dashboard values must come from the backend.

7. Teach Mode UI

Build the interface for this workflow:

Select subject → select topic → select difficulty → rate confidence → explain concept → submit → view evaluation → repair knowledge gap → re-teach → take quiz → view session results.

Support:

- Text explanations
- Browser speech-to-text using the Web Speech API when available
- Confidence slider from 0–100
- Evaluation score cards
- Strengths and knowledge gaps
- Misconception warnings
- AI Teacher explanations
- Follow-up questions
- Quiz interactions
- Final mastery comparison

Speech recognition must gracefully fall back to text input when unsupported or denied.

8. Integration contracts

Create a typed API client in "src/lib/api-client.ts".

Use these future endpoints:

- "GET /api/dashboard"
- "GET /api/topics"
- "POST /api/sessions"
- "GET /api/sessions/:id"
- "POST /api/sessions/:id/explanation"
- "POST /api/sessions/:id/evaluate"
- "POST /api/sessions/:id/next-question"
- "POST /api/quizzes"
- "POST /api/quizzes/:id/attempt"
- "GET /api/progress"
- "GET /api/knowledge-map"
- "GET /api/notes"
- "POST /api/notes"
- "GET /api/recommendations"
- "POST /api/study-plans"
- "GET /api/analytics"

Do not invent response types independently. Create shared TypeScript interfaces in "src/types/dualmind.ts", document them, and coordinate with Systems 2 and 3. Use the following evaluation shape as the initial contract:

{
score: number,
accuracy: number,
completeness: number,
clarity: number,
understanding: number,
strengths: string[],
knowledgeGaps: string[],
misconceptions: string[],
difficulty: "beginner" | "intermediate" | "advanced" | "expert",
feedback: string,
nextQuestion: string
}

Use a configurable API base path and a development-only mock adapter if the backend is not yet available. Never pretend that a real API call succeeded when it failed.

9. Interaction quality

Every button must have a working action. Forms must validate input. Navigation must work. Display useful loading and error states.

Do not hardcode a mastery increase after a click. Show values returned by the backend.

10. Boundaries

Own primarily:

- "src/app/(marketing)/"
- "src/app/(auth)/" UI only
- "src/app/(app)/" page layouts and shells
- "src/components/ui/"
- "src/components/layout/"
- "src/components/dashboard/"
- "src/components/teach/" presentation only
- "src/lib/api-client.ts"
- "src/types/dualmind.ts"
- Shared CSS and design tokens

Coordinate overlapping paths before replacing files.

11. Deliverables

- Working responsive frontend
- Reusable design system
- All required page layouts
- Typed API client
- Shared type definitions
- A list of dependencies to merge into the root package.json
- README_FRONTEND.md with setup instructions and API assumptions
- Screenshots of the major pages if possible

Run available TypeScript and lint checks. Fix errors. Clearly report anything that is not connected to the real backend.

Start by inspecting your repository, then implement the frontend in coherent milestones. Do not stop after generating a plan.

DUALMIND — SYSTEM 2: AI LEARNING ENGINE

You are responsible for DUALMIND's core innovation: an AI learning engine that evaluates student explanations, identifies knowledge gaps, teaches weak concepts, and verifies improvement.

Tagline: "Teach to Learn. Learn to Teach."

This is NOT a generic chatbot. The student must actively demonstrate understanding.

1. Technology

- TypeScript
- Zod for all AI input/output validation
- An AI provider abstraction supporting OpenAI, Gemini, and deterministic mock mode
- Server-side execution only for API-backed AI
- Next.js-compatible service modules

Do not build an independent frontend, authentication system, or database schema.

2. Main learning loop

Implement:

1. Receive subject, topic, difficulty, student explanation, and confidence.
2. Evaluate the explanation against the concept's expected knowledge.
3. Identify strengths, missing concepts, and misconceptions.
4. Select an appropriate difficulty.
5. Explain only the weakest concept.
6. Ask a targeted follow-up question.
7. Evaluate the student's second explanation.
8. Generate an adaptive quiz based on actual weaknesses.
9. Return results for mastery calculation and persistence by System 3.

3. Service architecture

Create these modules:

- "src/lib/ai/ai-provider.ts"
- "src/lib/ai/mock-provider.ts"
- "src/lib/ai/openai-provider.ts"
- "src/lib/ai/gemini-provider.ts"
- "src/lib/ai/evaluation-service.ts"
- "src/lib/ai/knowledge-gap-service.ts"
- "src/lib/ai/teacher-service.ts"
- "src/lib/ai/quiz-service.ts"
- "src/lib/ai/recommendation-service.ts"
- "src/lib/ai/note-service.ts"
- "src/lib/ai/study-plan-service.ts"
- "src/lib/ai/schemas.ts"
- "src/lib/ai/prompts.ts"

Adapt paths to the existing repository when necessary.

4. Provider abstraction

Create a shared interface so the application can switch providers using:

"AI_PROVIDER=mock"

Supported values:

- "mock"
- "openai"
- "gemini"

Use environment variables:

- "AI_PROVIDER"
- "AI_API_KEY"
- Optional provider-specific model settings

Never expose credentials to browser code or return them in logs.

If credentials are absent, the mock provider must work. If a real provider fails, return a controlled error or use a documented fallback policy.

5. Structured evaluation

Create a Zod schema with:

- score: 0–100
- accuracy: 0–100
- completeness: 0–100
- clarity: 0–100
- understanding: 0–100
- strengths: string array
- knowledgeGaps: string array
- misconceptions: string array
- difficulty: beginner/intermediate/advanced/expert
- feedback: string
- nextQuestion: string

Include identified concept IDs or stable concept keys wherever practical.

Validate all AI output. Handle malformed JSON, missing properties, unexpected values, and timeouts. Use bounded retries and then a controlled fallback. Never blindly trust model output.

6. Evaluation quality

Evaluate explanations based on conceptual correctness, completeness, clarity, and evidence of understanding.

Do not reward long answers merely for being long. Accept reasonable alternative wording. Distinguish a missing explanation from a factual misconception.

Use topic-specific expected concepts and evaluation rubrics. Do not use a single keyword match as the only evaluation method.

7. Adaptive difficulty

Use these rules:

- Score 85–100: increase difficulty when appropriate.
- Score 70–84: maintain difficulty.
- Score 50–69: reduce difficulty and target weak concepts.
- Score below 50: begin remediation.

Keep difficulty transitions configurable.

8. AI Teacher mode

For each identified knowledge gap:

- Explain one weak concept at a time.
- Use simple language.
- Provide an analogy and a concrete example.
- Ask one targeted question.
- Wait for the student to answer before explaining further.

Example:
A student struggles with runtime polymorphism.

Explain how a parent-class reference can refer to a child-class object and how an overridden method is selected at runtime. Then ask the student to explain the mechanism in their own words.

Do not dump an entire chapter.

9. Knowledge-gap engine

Track concept-level weaknesses and return structured results containing:

- Concept key
- Description
- Severity
- Evidence from the student's explanation
- Recommended remediation
- Follow-up question

Keep the service stateless where possible. Return results for System 3 to persist.

10. Confidence versus understanding

Accept the student's self-rated confidence before evaluation.

Compare the confidence score with the actual evaluation result. Return a confidence-gap value and an understandable interpretation.

Do not shame students or imply that confidence is a diagnosis. Treat it as a learning signal.

11. Adaptive quiz

Generate questions based on detected weaknesses.

Support:

- MCQ
- True/false
- Fill in the blank
- Short answer
- Scenario
- Explain the concept

Each question should have a stable ID, type, prompt, options where relevant, correct answer or grading rubric, explanation, and targeted concept keys.

Do not expose correct answers to the client before submission.

Validate quiz generation with Zod. Implement deterministic mock questions for Java OOP, DBMS, and Operating Systems.

12. Deterministic mock mode

Mock mode must be usable during a live hackathon demonstration without an API key.

It must:

- Evaluate the content of student input against expected concepts.
- Recognize configured correct and incorrect example explanations.
- Return different results for incomplete and improved explanations.
- Detect known misconception patterns in the demo topics.
- Generate targeted follow-up questions.
- Generate quizzes based on detected weaknesses.
- Simulate improved understanding only when the second explanation demonstrates improvement.

Do not randomly increase scores or return identical results for every submission.

Include fixtures for:

- Java Polymorphism
- DBMS Normalization
- Operating Systems Deadlocks

13. API integration

System 3 owns API routes and persistence. Export clean service functions for System 3 to call.

Agree on request/response schemas with System 3 and the shared type definitions with System 1. Do not create duplicate route handlers for the same endpoint.

14. Deliverables

- AI provider abstraction
- Evaluation and remediation services
- Knowledge-gap analysis
- Adaptive quiz generation and grading helpers
- Confidence comparison
- Validated Zod schemas
- Deterministic mock fixtures
- Unit tests covering evaluation, invalid JSON, difficulty adaptation, and quiz generation
- README_AI.md explaining providers, prompts, environment variables, and limitations

Run TypeScript, lint, and tests where available. Report real test results and any provider integration that remains incomplete.

Begin implementation after inspecting the repository. Prioritize a fully working Teach → Evaluate → Repair → Re-teach → Quiz flow.

DUALMIND — SYSTEM 3: BACKEND, DATABASE & AUTHENTICATION

You own the backend foundation for DUALMIND. Build secure APIs and persistent storage that connect the frontend from System 1, AI engine from System 2, and secondary features from System 4.

Do not create a separate application or duplicate the AI services.

1. Technology

- Next.js App Router and TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js or another properly integrated authentication solution
- Zod
- Secure server-side environment variables

Prefer a single Next.js application with route handlers unless the existing repository has a justified alternative.

2. Database

Create a maintainable Prisma schema with appropriate relationships, constraints, and indexes.

Required models:

- User
- Profile
- Subject
- Topic
- LearningSession
- StudentExplanation
- Evaluation
- KnowledgeGap
- Question
- Quiz
- QuizAttempt
- Progress
- Note
- Recommendation
- Achievement
- Streak
- StudyPlan
- RevisionSchedule

Add join or supporting models when needed.

Store:

- Evaluation metrics and feedback
- Student explanations
- Confidence ratings
- Identified concept weaknesses
- Quiz attempts and accuracy
- Topic mastery history
- Session timestamps
- Revision due dates and completion status
- Notes and study plans

Use appropriate timestamps and foreign keys. Ensure data belongs to the correct user.

3. Authentication

Implement:

- Signup
- Login
- Logout
- Session validation
- Protected routes and APIs
- User-specific data access
- Password hashing if using credentials
- Secure cookie/session configuration

Use Auth.js where appropriate. If using JWT, implement proper signing, expiration, and validation.

Do not trust a user ID supplied by the client as proof of identity. Derive the authenticated user from the verified server session.

4. Core API routes

Implement:

- "GET /api/dashboard"
- "GET /api/topics"
- "POST /api/topics"
- "POST /api/sessions"
- "GET /api/sessions/[id]"
- "POST /api/sessions/[id]/explanation"
- "POST /api/sessions/[id]/evaluate"
- "POST /api/sessions/[id]/next-question"
- "POST /api/quizzes"
- "POST /api/quizzes/[id]/attempt"
- "GET /api/progress"
- "GET /api/knowledge-map"
- "GET /api/notes"
- "POST /api/notes"
- "GET /api/recommendations"
- "POST /api/study-plans"
- "GET /api/analytics"

Implement note editing and deletion through appropriate additional routes. Use standard HTTP methods and clear response/error contracts.

5. AI engine integration

Import and call System 2's AI services.

Expected workflow:

1. Create a learning session.
2. Save the student's explanation and confidence.
3. Call the evaluation service.
4. Validate the response.
5. Persist evaluation and knowledge gaps.
6. Return feedback and the next question.
7. Save the re-explanation and its evaluation.
8. Generate and grade a gap-focused quiz.
9. Recalculate mastery and update progress.
10. Schedule the next revision.

Use transactions for related database updates where appropriate. Prevent duplicate scoring if requests are retried.

6. Mastery calculation

Implement a reusable, tested function:

DualMind Mastery Score =
40% Accuracy +
25% Completeness +
15% Clarity +
20% Quiz Performance.

Normalize all inputs to 0–100 and clamp the final result to 0–100.

If a quiz has not been completed, do not silently treat missing quiz data as a perfect score. Define and document how incomplete sessions are handled.

Treat mastery as a product metric, not a scientifically validated measurement.

Maintain topic mastery history so analytics can display actual changes over time.

7. Spaced revision

Implement default intervals of:

- 1 day
- 3 days
- 7 days
- 14 days
- 30 days

Use quiz and evaluation performance to bring revision forward for weak topics and extend intervals for consistently strong performance.

Avoid creating duplicate active revision records for the same topic and session.

8. Dashboard and analytics

Build server-side queries for:

- Overall mastery
- Study streak
- Total study time
- Topics mastered
- Current knowledge gaps
- Recent sessions
- Upcoming revisions
- Mastery history
- Quiz accuracy
- Confidence versus understanding

Use real database records, not fixed dashboard numbers.

9. Validation and security

Implement:

- Zod request validation
- Ownership checks on every user-specific resource
- Safe database access
- Consistent error responses
- Input length limits
- Appropriate rate limiting
- Secure authentication
- No secrets in frontend bundles
- No raw stack traces in API responses

Handle missing records and unauthorized access correctly.

10. Demo data

Create an idempotent Prisma seed script for a demo user with Java, DBMS, and Operating Systems topics.

Seed representative sessions, evaluations, knowledge gaps, quiz results, notes, achievements, and revision records.

Keep demo data clearly identified. Do not expose another user's private records through demo routes.

Provide a reliable demo sign-in path suitable for local judging without weakening production authentication.

11. Environment and setup

Support:

- "DATABASE_URL"
- "AUTH_SECRET"
- "AI_PROVIDER"
- "AI_API_KEY"

Create ".env.example" with placeholders only.

Document migrations, seeding, database setup, and local startup. Do not overwrite other systems' package scripts without coordination.

12. Ownership

Own primarily:

- "prisma/"
- "src/app/api/"
- "src/lib/db/"
- "src/lib/auth/"
- "src/lib/progress/"
- "src/lib/revision/"
- Backend validation and integration tests

Coordinate the shared types and AI service imports with Systems 1 and 2.

13. Deliverables

- Complete Prisma schema
- Migrations and seed script
- Authentication and authorization
- Persistent APIs
- Mastery and revision engines
- Dashboard/analytics queries
- API error conventions
- Tests for authentication, ownership, persistence, mastery, and revision
- README_BACKEND.md

Run the available checks. Report any dependency on an unconfigured database or service. Never claim database operations were tested if the database was unavailable.

Start by inspecting the repository, then implement the database and core APIs in working phases.

DUALMIND — SYSTEM 4: LEARNING TOOLS, ANALYTICS & QUALITY ASSURANCE

You are responsible for the supporting learning features that make DUALMIND a complete EdTech product, plus integration support and quality assurance.

The main learning engine is owned by System 2. Backend APIs, authentication, and Prisma are owned by System 3. The main design system and application shell are owned by System 1.

Build modules that can be merged into the same Next.js application. Do not create a separate deployable product.

1. Technology

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Recharts
- Prisma models and API contracts provided by System 3
- Zod for input validation

Do not independently redesign the global theme or create a second database schema.

2. Knowledge map

Create a responsive concept map showing relationships between topics and subtopics.

Example:

Operating Systems

- Processes: 91%
- Scheduling: 87%
- Deadlock: 48%
  - Circular Wait: 35%
  - Resource Allocation Graph: 42%
  - Hold and Wait: 70%

Statuses:

- Mastered
- Learning
- Needs Revision
- Not Started

Each concept should display its mastery score, attempts, weak areas, and recent activity.

Clicking a concept should open a detail panel with:

- Current mastery
- Previous evaluation results
- Knowledge gaps
- Recommended next action
- Revision date
- Start learning button

Fetch real data from System 3's knowledge-map and progress APIs. Clearly label any fallback demo data.

Use an accessible list or tree view when an interactive visual map is unsuitable for mobile or keyboard navigation.

3. Smart notes

Create a notes module with:

- Automatic session notes using System 2's note-generation service
- What I learned
- What I struggled with
- Correct understanding
- Examples
- Revision points
- Edit, search, and delete
- Topic tags and timestamps

Persist notes through System 3's APIs. Verify that one user cannot access another user's notes.

4. Personalized study plans

Create a study planner that accepts:

- Exam date
- Subjects
- Available daily study time
- Preferred study days
- Current mastery

Generate a plan that prioritizes weak concepts and upcoming revisions.

Display daily tasks with topic, estimated duration, priority, and completion status.

Use the study-plan service from System 2 and persist plans using System 3's APIs. Do not invent a separate AI implementation.

5. Revision center

Build a revision page showing:

- Due today
- Upcoming revisions
- Overdue concepts
- Recently completed revisions

Support intervals of 1, 3, 7, 14, and 30 days, as managed by System 3.

Provide actions to begin a revision session and mark a revision complete only after the appropriate workflow succeeds.

Do not modify the revision algorithm independently.

6. Analytics

Use Recharts to display:

- Mastery over time
- Quiz accuracy
- Study time
- Topics mastered
- Knowledge gaps
- Confidence versus actual understanding
- Subject performance

Include date filters and useful empty states.

Use actual persisted metrics. Calculate improvements from historical records rather than hardcoding example percentages.

Make charts responsive and accessible. Provide text summaries for important trends.

7. Achievements and streaks

Implement meaningful achievements:

- First Teacher
- 5 Topics Mastered
- 7 Day Streak
- Knowledge Gap Crusher
- 10 Topics Taught

Award achievements for completed actions, learning improvement, and revision—not simply opening pages.

Use backend persistence and prevent duplicate awards. Do not award a streak merely because the dashboard is opened.

8. Demo experience

Prepare a realistic end-to-end demonstration for Java Polymorphism.

The demo should let a judge:

1. Open the application in demo mode.
2. Choose Java Polymorphism.
3. Submit an initial explanation.
4. See actual evaluation output from System 2.
5. Receive targeted remediation.
6. Re-teach the concept.
7. Take an adaptive quiz.
8. See updated mastery and knowledge gaps.
9. Open the knowledge map.
10. View the scheduled revision and analytics.

Demo data must be initialized through the agreed seed/mock mechanism. Do not fabricate a mastery increase just to match a desired result.

9. Integration and QA

Create an integration checklist covering:

- Landing page navigation
- Demo entry
- Authentication
- Session creation
- Explanation submission
- Evaluation and knowledge-gap detection
- Re-teaching
- Quiz submission and scoring
- Mastery persistence
- Knowledge-map refresh
- Notes
- Study plans
- Revision scheduling
- Analytics
- Achievements
- Mobile layouts
- Loading and API error states

Test refresh persistence and verify that failed requests do not display success states.

Write tests for your modules. Fix TypeScript and lint errors where possible.

If another module is not yet available, define the required interface and document the dependency instead of building a competing implementation.

10. Ownership

Own primarily:

- "src/components/knowledge-map/"
- "src/components/notes/"
- "src/components/study-plan/"
- "src/components/revision/"
- "src/components/analytics/"
- "src/components/achievements/"
- Corresponding page modules, where coordinated with System 1
- Feature tests and integration documentation

Use shared UI components and the existing API client whenever available.

Do not replace global navigation, authentication, Prisma, AI services, or the root package configuration.

11. Deliverables

- Knowledge map
- Notes
- Study planner
- Revision center
- Analytics charts
- Achievement components
- Demo scenario and integration checklist
- Automated tests
- README_FEATURES.md
- List of files, dependencies, and integration assumptions

Inspect the repository first. Implement and test the features in order of priority. Report incomplete features and actual test results honestly.
