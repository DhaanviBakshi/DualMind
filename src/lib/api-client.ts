/**
 * DUALMIND — Typed API Client & Integration Gateway
 * System 1: Frontend & UI
 * 
 * Supports:
 * 1. Configurable API base path (Environment variable or runtime settings)
 * 2. Strict typed contracts aligned with System 2 (AI Engine) and System 3 (Backend)
 * 3. High-fidelity development mock adapter with client persistence
 * 4. Transparent error handling that never disguises real network/backend failures
 */

import {
  DashboardData,
  Topic,
  TeachSession,
  EvaluationResult,
  Quiz,
  QuizAttemptPayload,
  QuizAttemptResult,
  KnowledgeMapData,
  StudyNote,
  StudyPlan,
  AnalyticsData,
  UserProfile,
  DifficultyLevel,
} from "@/types/dualmind";

export class DualMindApiError extends Error {
  status: number;
  endpoint: string;
  details?: unknown;

  constructor(message: string, status: number, endpoint: string, details?: unknown) {
    super(message);
    this.name = "DualMindApiError";
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }
}

// Configuration helpers
export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("dualmind_api_base_url");
    if (custom) return custom;
  }
  return process.env.NEXT_PUBLIC_API_URL || "/api";
};

export const isMockModeEnabled = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("dualmind_use_mock_api");
    if (stored !== null) return stored === "true";
  }
  // Default to mock mode in dev/preview if no live backend configured
  return process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
};

export const setMockMode = (enabled: boolean): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("dualmind_use_mock_api", enabled ? "true" : "false");
    window.dispatchEvent(new Event("dualmind_mock_mode_changed"));
  }
};

export const setApiBaseUrl = (url: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("dualmind_api_base_url", url);
    window.dispatchEvent(new Event("dualmind_api_url_changed"));
  }
};

// ==========================================
// MOCK DATA GENERATOR & STORAGE (DEV ONLY)
// ==========================================

const INITIAL_TOPICS: Topic[] = [
  {
    id: "top-attention-mech",
    subjectId: "sub-ml",
    subjectTitle: "Machine Learning & AI",
    title: "Self-Attention Mechanism",
    description: "Understand query, key, value projections and how scaled dot-product attention computes token contextualization.",
    difficulty: "advanced",
    estimatedMinutes: 25,
    prerequisites: ["Matrix Multiplication", "Softmax Activation", "Word Embeddings"],
    tags: ["Transformers", "Deep Learning", "NLP"],
    masteryScore: 78,
    status: "in-progress",
    recommendedReason: "Prerequisite for understanding multi-head transformer heads."
  },
  {
    id: "top-backprop",
    subjectId: "sub-ml",
    subjectTitle: "Machine Learning & AI",
    title: "Backpropagation & Chain Rule",
    description: "Reverse-mode automatic differentiation through computational graphs to update weights.",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    prerequisites: ["Multivariate Calculus", "Gradient Descent"],
    tags: ["Neural Networks", "Optimization"],
    masteryScore: 92,
    status: "mastered",
  },
  {
    id: "top-consensus-raft",
    subjectId: "sub-sys",
    subjectTitle: "Distributed Systems",
    title: "Raft Consensus Algorithm",
    description: "Leader election, log replication, and safety guarantees in distributed fault-tolerant clusters.",
    difficulty: "advanced",
    estimatedMinutes: 35,
    prerequisites: ["State Machine Replication", "Network Partitions"],
    tags: ["Consensus", "Fault Tolerance", "Distributed Storage"],
    masteryScore: 45,
    status: "needs-review",
    recommendedReason: "Recent misconception detected in Leader Lease safety."
  },
  {
    id: "top-quantum-superposition",
    subjectId: "sub-phys",
    subjectTitle: "Quantum Computing",
    title: "Quantum Superposition & Qubits",
    description: "Bloch sphere state representation, Hadamard gates, and collapse upon measurement.",
    difficulty: "beginner",
    estimatedMinutes: 20,
    prerequisites: ["Linear Algebra", "Complex Numbers"],
    tags: ["Quantum Gates", "Qubits", "Quantum Mechanics"],
    masteryScore: 60,
    status: "in-progress",
  },
  {
    id: "top-heaps-priority",
    subjectId: "sub-dsa",
    subjectTitle: "Data Structures & Algorithms",
    title: "Binary Heaps & Heapify",
    description: "Complete binary tree representation, sift-up, sift-down operations, and O(n) build-heap proof.",
    difficulty: "intermediate",
    estimatedMinutes: 25,
    prerequisites: ["Binary Trees", "Array Mapping"],
    tags: ["Heaps", "Priority Queues", "Graph Algorithms"],
    masteryScore: 88,
    status: "mastered",
  },
  {
    id: "top-neuro-synaptic",
    subjectId: "sub-neuro",
    subjectTitle: "Neuroscience",
    title: "Long-Term Potentiation (LTP)",
    description: "NMDA receptor signaling, calcium influx, and synaptic plasticity as the substrate of biological memory.",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    prerequisites: ["Action Potential", "Neurotransmitters"],
    tags: ["Memory", "Synapse", "Neurobiology"],
    masteryScore: 35,
    status: "needs-review",
    recommendedReason: "Scheduled for spaced repetition revision today."
  }
];

const INITIAL_DASHBOARD: DashboardData = {
  user: {
    name: "Alex Vance",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    streakDays: 14,
    overallMastery: 74,
    studyTimeMinutes: 1840,
    topicsMasteredCount: 28,
  },
  criticalKnowledgeGaps: [
    {
      topicId: "top-consensus-raft",
      topicTitle: "Raft Consensus Algorithm",
      gapDescription: "Confused log index matching with term synchronization during split-vote recovery.",
      urgency: "high"
    },
    {
      topicId: "top-neuro-synaptic",
      topicTitle: "Long-Term Potentiation (LTP)",
      gapDescription: "Omitted magnesium ion block displacement in NMDA channels.",
      urgency: "medium"
    }
  ],
  recentSessions: [
    {
      id: "sess-101",
      topicTitle: "Self-Attention Mechanism",
      subjectTitle: "Machine Learning & AI",
      date: "2 hours ago",
      score: 84,
      difficulty: "advanced"
    },
    {
      id: "sess-100",
      topicTitle: "Binary Heaps & Heapify",
      subjectTitle: "Data Structures & Algorithms",
      date: "Yesterday",
      score: 91,
      difficulty: "intermediate"
    },
    {
      id: "sess-099",
      topicTitle: "Raft Consensus Algorithm",
      subjectTitle: "Distributed Systems",
      date: "3 days ago",
      score: 62,
      difficulty: "advanced"
    }
  ],
  recommendedTopics: INITIAL_TOPICS.slice(0, 3),
  todaysRevisionDue: {
    dueCount: 4,
    estimatedMinutes: 15,
    urgentCards: [
      {
        id: "rev-1",
        topicId: "top-attention-mech",
        topicTitle: "Self-Attention Mechanism",
        prompt: "Why is the dot-product scaled by 1/sqrt(d_k) before softmax?",
        answer: "To prevent the dot products from growing excessively large for high dimensions, which would push softmax into regions with vanishing gradients.",
        analogyTip: "Imagine normalizing volume before a microphone amplifier so it doesn't clip.",
        intervalDays: 4,
        repetitionCount: 3,
        easeFactor: 2.5,
        dueDate: "Today"
      },
      {
        id: "rev-2",
        topicId: "top-neuro-synaptic",
        topicTitle: "Long-Term Potentiation (LTP)",
        prompt: "What physiological role does the Mg2+ plug play in the NMDA channel?",
        answer: "It acts as a coincidence detector: it blocks the channel until membrane depolarization repels it, allowing Ca2+ influx only when pre- and post-synaptic neurons fire simultaneously.",
        analogyTip: "A physical lock that requires a key (glutamate) AND a voltage password (depolarization).",
        intervalDays: 2,
        repetitionCount: 1,
        easeFactor: 2.1,
        dueDate: "Today"
      }
    ]
  },
  studyPlanOverview: {
    paceStatus: "on-track",
    completedTasksToday: 2,
    totalTasksToday: 3,
    nextUp: {
      id: "sp-item-1",
      dayOfWeek: "Fri",
      date: "Today",
      topicId: "top-quantum-superposition",
      topicTitle: "Quantum Superposition & Qubits",
      subjectTitle: "Quantum Computing",
      allocatedMinutes: 25,
      targetTask: "Teach",
      isCompleted: false
    }
  ,
  },
  weeklyMasterySparkline: [
    { day: "Mon", score: 68 },
    { day: "Tue", score: 70 },
    { day: "Wed", score: 70 },
    { day: "Thu", score: 72 },
    { day: "Fri", score: 74 },
    { day: "Sat", score: 74 },
    { day: "Sun", score: 75 }
  ]
};

// ==========================================
// CORE API CLIENT IMPLEMENTATION
// ==========================================

export const apiClient = {
  /**
   * Generic internal fetch wrapper that handles mock toggling and errors.
   */
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isMock = isMockModeEnabled();
    const baseUrl = getApiBaseUrl();

    if (!isMock) {
      const fullUrl = `${baseUrl.replace(/\/$/, "")}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
      try {
        const response = await fetch(fullUrl, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
          },
        });

        if (!response.ok) {
          let errorBody: unknown;
          try {
            errorBody = await response.json();
          } catch {
            errorBody = await response.text();
          }
          throw new DualMindApiError(
            `API error from ${endpoint}: ${response.status} ${response.statusText}`,
            response.status,
            endpoint,
            errorBody
          );
        }

        return (await response.json()) as T;
      } catch (err: unknown) {
        if (err instanceof DualMindApiError) throw err;
        throw new DualMindApiError(
          `Network failure reaching ${fullUrl}: ${err instanceof Error ? err.message : String(err)}`,
          0,
          endpoint,
          err
        );
      }
    }

    // Otherwise, simulate network latency in dev mock mode
    await new Promise((resolve) => setTimeout(resolve, 350));
    return this.mockRoute<T>(endpoint, options);
  },

  /**
   * High fidelity mock resolver supporting all required platform workflows.
   */
  async mockRoute<T>(endpoint: string, options: RequestInit): Promise<T> {
    const method = options.method?.toUpperCase() || "GET";
    const body = options.body ? JSON.parse(options.body as string) : null;

    // GET /api/dashboard
    if (endpoint === "/api/dashboard" && method === "GET") {
      return INITIAL_DASHBOARD as unknown as T;
    }

    // GET /api/topics
    if (endpoint === "/api/topics" && method === "GET") {
      return INITIAL_TOPICS as unknown as T;
    }

    // POST /api/sessions
    if (endpoint === "/api/sessions" && method === "POST") {
      const newSession: TeachSession = {
        id: `sess-${Date.now()}`,
        userId: "user-current",
        subjectId: body.subjectId || "sub-ml",
        subjectTitle: body.subjectTitle || "Machine Learning & AI",
        topicId: body.topicId || "top-attention-mech",
        topicTitle: body.topicTitle || "Self-Attention Mechanism",
        difficulty: body.difficulty || "intermediate",
        initialConfidence: body.initialConfidence ?? 50,
        status: "explaining",
        createdAt: new Date().toISOString(),
      };
      return newSession as unknown as T;
    }

    // GET /api/sessions/:id
    if (endpoint.startsWith("/api/sessions/") && method === "GET" && !endpoint.includes("/explanation") && !endpoint.includes("/evaluate") && !endpoint.includes("/next-question")) {
      const id = endpoint.split("/")[3];
      return {
        id,
        userId: "user-current",
        subjectId: "sub-ml",
        subjectTitle: "Machine Learning & AI",
        topicId: "top-attention-mech",
        topicTitle: "Self-Attention Mechanism",
        difficulty: "intermediate",
        initialConfidence: 65,
        status: "explaining",
        createdAt: new Date().toISOString(),
      } as unknown as T;
    }

    // POST /api/sessions/:id/explanation
    if (endpoint.match(/\/api\/sessions\/[^/]+\/explanation/) && method === "POST") {
      return {
        success: true,
        wordCount: (body.explanation || "").split(/\s+/).filter(Boolean).length,
        receivedAt: new Date().toISOString(),
      } as unknown as T;
    }

    // POST /api/sessions/:id/evaluate
    if (endpoint.match(/\/api\/sessions\/[^/]+\/evaluate/) && method === "POST") {
      const explanationText = body.explanation || "";
      const wordCount = explanationText.split(/\s+/).filter(Boolean).length;
      
      // Dynamic evaluation feedback based on content depth
      const evaluation: EvaluationResult = {
        score: Math.min(95, Math.max(55, Math.floor(55 + wordCount * 0.4))),
        accuracy: 86,
        completeness: Math.min(90, Math.max(50, 60 + Math.floor(wordCount * 0.3))),
        clarity: 88,
        understanding: 82,
        strengths: [
          "Accurately defined the mathematical mapping of Query, Key, and Value vectors.",
          "Clear explanation of why dot-product measures token similarity.",
          "Effective real-world analogy comparing tokens to database retrieval indices."
        ],
        knowledgeGaps: [
          "Did not fully address why the scaling factor (1/sqrt(d_k)) prevents gradient vanishing during softmax saturation.",
          "Omitted the computation of positional encodings before self-attention projection."
        ],
        misconceptions: [
          "Stated that attention replaces recurrence entirely without noting that self-attention is permutation-invariant without positional encodings."
        ],
        difficulty: (body.difficulty as DifficultyLevel) || "intermediate",
        feedback: "Impressive conceptual foundation! You clearly understand how tokens attend to each other. To achieve mastery, articulate why scaling prevents large dot products from saturating softmax, and how the model distinguishes token order without recurrence.",
        nextQuestion: "If we shuffle all input tokens into arbitrary order, how does standard self-attention compute different representations, or does it fail to distinguish order?"
      };
      return evaluation as unknown as T;
    }

    // POST /api/sessions/:id/next-question
    if (endpoint.match(/\/api\/sessions\/[^/]+\/next-question/) && method === "POST") {
      return {
        nextQuestion: "Now suppose your Key and Value dimensions differ from Query. What constraint does matrix multiplication impose on their inner dimensions?",
        contextTip: "Focus on the inner dimension match required for softmax(Q * K^T) * V."
      } as unknown as T;
    }

    // POST /api/quizzes
    if (endpoint === "/api/quizzes" && method === "POST") {
      const quiz: Quiz = {
        id: `quiz-${Date.now()}`,
        topicId: body.topicId || "top-attention-mech",
        topicTitle: body.topicTitle || "Self-Attention Mechanism",
        timeLimitMinutes: 10,
        questions: [
          {
            id: "q-1",
            prompt: "Why is the scaled dot-product attention formula divided by the square root of d_k?",
            options: [
              "To enforce dimensionality reduction on the resulting matrix",
              "To prevent large dot products from driving the softmax function into regions with tiny gradients",
              "To ensure the resulting weights sum to zero",
              "To convert vectors into unit norm spheres"
            ],
            correctOptionIndex: 1,
            explanation: "For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. Dividing by sqrt(d_k) stabilizes backpropagation.",
            relatedConcept: "Softmax Saturation & Stability",
            difficulty: "intermediate"
          },
          {
            id: "q-2",
            prompt: "What makes pure self-attention permutation-invariant if positional embeddings are omitted?",
            options: [
              "Matrix multiplication is commutative for non-square matrices",
              "Softmax calculates pairwise relationships independently of spatial order in the sequence",
              "The Query and Key matrices have equal eigenvalues",
              "LayerNorm normalizes sequence ordering into uniform distribution"
            ],
            correctOptionIndex: 1,
            explanation: "Without positional encodings, swapping any two tokens produces the exact same attention score distribution up to permutation of output rows.",
            relatedConcept: "Permutation Invariance",
            difficulty: "advanced"
          },
          {
            id: "q-3",
            prompt: "In the transformer architecture, what is the role of the Value (V) matrix?",
            options: [
              "It determines which tokens are queried by the current token",
              "It contains the actual feature representations that are linearly combined using attention weights",
              "It regularizes weights using dropout",
              "It computes the similarity score with Key vectors"
            ],
            correctOptionIndex: 1,
            explanation: "The attention weights from Q and K determine 'how much' to pull from each token's Value vector.",
            relatedConcept: "Value Projection",
            difficulty: "intermediate"
          }
        ]
      };
      return quiz as unknown as T;
    }

    // POST /api/quizzes/:id/attempt
    if (endpoint.match(/\/api\/quizzes\/[^/]+\/attempt/) && method === "POST") {
      const answers = body.answers || [];
      const totalQuestions = answers.length || 3;
      // Calculate realistic attempt feedback
      const correctCount = Math.max(1, totalQuestions - 1);
      const score = Math.round((correctCount / totalQuestions) * 100);
      const attemptResult: QuizAttemptResult = {
        quizId: endpoint.split("/")[3],
        score,
        correctCount,
        totalQuestions,
        masteryGained: 12,
        feedback: "Strong conceptual retention! You solved the scaling factor and value matrix questions with high accuracy.",
        reviewItems: [
          {
            questionId: "q-1",
            isCorrect: true,
            selectedOptionIndex: 1,
            correctOptionIndex: 1,
            explanation: "Correct! Dividing by sqrt(d_k) prevents vanishing gradients caused by softmax saturation."
          },
          {
            questionId: "q-2",
            isCorrect: answers[1]?.selectedOptionIndex === 1,
            selectedOptionIndex: answers[1]?.selectedOptionIndex ?? 0,
            correctOptionIndex: 1,
            explanation: "Softmax calculates pairwise relationships independently of index order."
          },
          {
            questionId: "q-3",
            isCorrect: true,
            selectedOptionIndex: 1,
            correctOptionIndex: 1,
            explanation: "Correct! Value vectors are the payload being weighted by attention coefficients."
          }
        ]
      };
      return attemptResult as unknown as T;
    }

    // GET /api/progress
    if (endpoint === "/api/progress" && method === "GET") {
      return {
        overallMastery: 74,
        totalTopicsStudied: 32,
        streakDays: 14,
        studyHoursThisMonth: 28.5,
        masteryByDifficulty: {
          beginner: 94,
          intermediate: 78,
          advanced: 64,
          expert: 42
        }
      } as unknown as T;
    }

    // GET /api/knowledge-map
    if (endpoint === "/api/knowledge-map" && method === "GET") {
      const mapData: KnowledgeMapData = {
        subjectFilters: ["All", "Machine Learning", "Distributed Systems", "Quantum Computing", "Data Structures"],
        nodes: [
          { id: "n1", label: "Linear Algebra", subject: "Machine Learning", difficulty: "beginner", status: "mastered", masteryLevel: 95, prerequisites: [], x: 120, y: 150, summary: "Vectors, matrices, dot products, and eigenspaces." },
          { id: "n2", label: "Gradient Descent", subject: "Machine Learning", difficulty: "beginner", status: "mastered", masteryLevel: 90, prerequisites: ["n1"], x: 280, y: 150, summary: "Loss surfaces, learning rates, and gradient updates." },
          { id: "n3", label: "Backpropagation", subject: "Machine Learning", difficulty: "intermediate", status: "mastered", masteryLevel: 88, prerequisites: ["n2"], x: 440, y: 150, summary: "Chain rule automatic differentiation." },
          { id: "n4", label: "Self-Attention", subject: "Machine Learning", difficulty: "advanced", status: "in-progress", masteryLevel: 78, prerequisites: ["n3"], x: 620, y: 150, summary: "Scaled dot-product attention and QKV projection." },
          { id: "n5", label: "Transformer Architectures", subject: "Machine Learning", difficulty: "expert", status: "locked", masteryLevel: 15, prerequisites: ["n4"], x: 800, y: 150, summary: "Decoder-only LLMs, causal masking, and flash attention." },
          { id: "n6", label: "Network Partitions", subject: "Distributed Systems", difficulty: "intermediate", status: "mastered", masteryLevel: 85, prerequisites: [], x: 200, y: 350, summary: "CAP theorem, split brain, and network latency." },
          { id: "n7", label: "Raft Consensus", subject: "Distributed Systems", difficulty: "advanced", status: "needs-review", masteryLevel: 45, prerequisites: ["n6"], x: 420, y: 350, summary: "Leader election, heartbeat terms, and state logs." },
          { id: "n8", label: "Byzantine Fault Tolerance", subject: "Distributed Systems", difficulty: "expert", status: "locked", masteryLevel: 10, prerequisites: ["n7"], x: 650, y: 350, summary: "Malicious nodes, PBFT consensus, and signature quorum." },
          { id: "n9", label: "Binary Heaps", subject: "Data Structures", difficulty: "intermediate", status: "mastered", masteryLevel: 92, prerequisites: [], x: 300, y: 520, summary: "Array representation of complete binary trees." },
          { id: "n10", label: "Priority Queues", subject: "Data Structures", difficulty: "intermediate", status: "mastered", masteryLevel: 90, prerequisites: ["n9"], x: 500, y: 520, summary: "Dijkstra and A* algorithm optimization using min-heaps." }
        ],
        edges: [
          { from: "n1", to: "n2", type: "prerequisite" },
          { from: "n2", to: "n3", type: "prerequisite" },
          { from: "n3", to: "n4", type: "prerequisite" },
          { from: "n4", to: "n5", type: "prerequisite" },
          { from: "n6", to: "n7", type: "prerequisite" },
          { from: "n7", to: "n8", type: "prerequisite" },
          { from: "n9", to: "n10", type: "prerequisite" }
        ]
      };
      return mapData as unknown as T;
    }

    // GET /api/notes
    if (endpoint === "/api/notes" && method === "GET") {
      const notes: StudyNote[] = [
        {
          id: "note-1",
          topicId: "top-attention-mech",
          topicTitle: "Self-Attention Mechanism",
          subjectTitle: "Machine Learning & AI",
          title: "Feynman Breakdown: Why Self-Attention Scales",
          summary: "Core synthesis of Query, Key, and Value projections and the scaling factor intuition.",
          content: `# Self-Attention Mechanism\n\n### The Intuitive Analogy\nThink of self-attention as a **library index system**:\n- **Query**: What you are searching for in the catalog.\n- **Key**: The label on the book spine.\n- **Value**: The actual text content inside the book.\n\nWhen a word attends to another word, it computes similarity between its **Query** and all other words' **Keys**.\n\n### The Critical Scaling Formula\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V$$\n\nWhy divide by $\\sqrt{d_k}$?\nIf $d_k$ is large, variance of the inner product is proportional to $d_k$. Without scaling, large magnitudes push softmax into saturated regions with derivative $\\approx 0$, stalling gradient descent.`,
          feynmanBreakdown: {
            simpleAnalogy: "A search engine query matching indexed page titles to retrieve article content.",
            coreDefinition: "Context-sensitive weighted sum of value representations where weights are normalized dot products of query and key vectors.",
            commonPitfall: "Thinking attention understands word order without positional encodings."
          },
          tags: ["Transformers", "Deep Learning", "Attention"],
          flashcardCount: 6,
          updatedAt: "2026-10-08T18:40:00Z"
        },
        {
          id: "note-2",
          topicId: "top-consensus-raft",
          topicTitle: "Raft Consensus Algorithm",
          subjectTitle: "Distributed Systems",
          title: "Raft: Leader Election & Log Invariant",
          summary: "Key safety mechanisms that guarantee only updated nodes become leader.",
          content: `# Raft Consensus\n\n### Leader Election Rule\nA candidate cannot win election unless its log is **at least as up-to-date** as the majority of voters' logs.\n\n### Terms as Logical Clocks\nEvery message contains a term number. If a leader receives a message from a node with a higher term, it must immediately step down to follower status.`,
          feynmanBreakdown: {
            simpleAnalogy: "A committee election where you can only be chair if you have the most complete minutes book.",
            coreDefinition: "Consensus protocol decomposed into leader election, log replication, and safety.",
            commonPitfall: "Thinking split votes cause infinite locks; randomized election timeouts break symmetry."
          },
          tags: ["Distributed Systems", "Consensus", "Fault Tolerance"],
          flashcardCount: 5,
          updatedAt: "2026-10-06T11:20:00Z"
        }
      ];
      return notes as unknown as T;
    }

    // POST /api/notes
    if (endpoint === "/api/notes" && method === "POST") {
      const newNote: StudyNote = {
        id: `note-${Date.now()}`,
        topicId: body.topicId || "top-custom",
        topicTitle: body.topicTitle || "Custom Synthesis",
        subjectTitle: body.subjectTitle || "General",
        title: body.title || "Untitled Active Note",
        summary: body.summary || "Summary of taught concepts and repaired knowledge gaps.",
        content: body.content || "",
        feynmanBreakdown: body.feynmanBreakdown || {
          simpleAnalogy: "Analogy created during teach session.",
          coreDefinition: "Key mathematical and conceptual definition.",
          commonPitfall: "Common pitfall noted in feedback."
        },
        tags: body.tags || ["Active Recall"],
        flashcardCount: 3,
        updatedAt: new Date().toISOString()
      };
      return newNote as unknown as T;
    }

    // GET /api/recommendations
    if (endpoint === "/api/recommendations" && method === "GET") {
      return INITIAL_TOPICS.slice(0, 4) as unknown as T;
    }

    // POST /api/study-plans
    if (endpoint === "/api/study-plans" && method === "POST") {
      const createdPlan: StudyPlan = {
        id: `plan-${Date.now()}`,
        title: body.title || "Active Learning Mastery Sprint",
        targetExamOrGoal: body.targetExamOrGoal || "Deep Technical Mastery",
        weeklyHourTarget: body.weeklyHourTarget || 10,
        currentWeeklyHours: 4.5,
        paceStatus: "on-track",
        items: [
          {
            id: "sp-1",
            dayOfWeek: "Mon",
            date: "2026-10-12",
            topicId: "top-attention-mech",
            topicTitle: "Self-Attention Mechanism",
            subjectTitle: "Machine Learning",
            allocatedMinutes: 30,
            targetTask: "Teach",
            isCompleted: true
          },
          {
            id: "sp-2",
            dayOfWeek: "Wed",
            date: "2026-10-14",
            topicId: "top-consensus-raft",
            topicTitle: "Raft Consensus Algorithm",
            subjectTitle: "Distributed Systems",
            allocatedMinutes: 35,
            targetTask: "Review Gap",
            isCompleted: false
          },
          {
            id: "sp-3",
            dayOfWeek: "Fri",
            date: "2026-10-16",
            topicId: "top-quantum-superposition",
            topicTitle: "Quantum Superposition & Qubits",
            subjectTitle: "Quantum Computing",
            allocatedMinutes: 25,
            targetTask: "Deep Quiz",
            isCompleted: false
          }
        ]
      };
      return createdPlan as unknown as T;
    }

    // GET /api/analytics
    if (endpoint === "/api/analytics" && method === "GET") {
      const analytics: AnalyticsData = {
        masteryTimeline: [
          { date: "Sep 12", masteryScore: 42, sessionsCount: 4 },
          { date: "Sep 19", masteryScore: 51, sessionsCount: 6 },
          { date: "Sep 26", masteryScore: 60, sessionsCount: 8 },
          { date: "Oct 03", masteryScore: 68, sessionsCount: 9 },
          { date: "Oct 09", masteryScore: 74, sessionsCount: 11 }
        ],
        cognitiveDimensions: [
          { dimension: "Accuracy", currentScore: 86, benchmarkScore: 70 },
          { dimension: "Completeness", currentScore: 74, benchmarkScore: 65 },
          { dimension: "Clarity", currentScore: 89, benchmarkScore: 68 },
          { dimension: "Understanding", currentScore: 82, benchmarkScore: 65 },
          { dimension: "Retention", currentScore: 79, benchmarkScore: 60 }
        ],
        studyTimeBySubject: [
          { subject: "Machine Learning", hours: 14.5, percentage: 46 },
          { subject: "Distributed Systems", hours: 8.2, percentage: 26 },
          { subject: "Data Structures", hours: 5.4, percentage: 17 },
          { subject: "Neuroscience", hours: 3.4, percentage: 11 }
        ],
        misconceptionsByCategory: [
          { category: "Premature Convergence", count: 7, resolvedCount: 6 },
          { category: "Permutation Asymmetry", count: 5, resolvedCount: 4 },
          { category: "Edge Conditions", count: 8, resolvedCount: 7 },
          { category: "Physical Intuition Gaps", count: 4, resolvedCount: 3 }
        ],
        weeklyActivity: [
          { day: "Mon", minutes: 45, sessions: 2 },
          { day: "Tue", minutes: 30, sessions: 1 },
          { day: "Wed", minutes: 60, sessions: 2 },
          { day: "Thu", minutes: 40, sessions: 2 },
          { day: "Fri", minutes: 50, sessions: 2 },
          { day: "Sat", minutes: 75, sessions: 3 },
          { day: "Sun", minutes: 45, sessions: 2 }
        ]
      };
      return analytics as unknown as T;
    }

    throw new DualMindApiError(`Mock handler not implemented for ${method} ${endpoint}`, 404, endpoint);
  },

  // ==========================================
  // TYPED ENDPOINT METHODS (EXACT SYSTEM CONTRACT)
  // ==========================================

  /** GET /api/dashboard */
  getDashboard(): Promise<DashboardData> {
    return this.request<DashboardData>("/api/dashboard", { method: "GET" });
  },

  /** GET /api/topics */
  getTopics(): Promise<Topic[]> {
    return this.request<Topic[]>("/api/topics", { method: "GET" });
  },

  /** POST /api/sessions */
  createSession(payload: {
    subjectId: string;
    subjectTitle: string;
    topicId: string;
    topicTitle: string;
    difficulty: DifficultyLevel;
    initialConfidence: number;
  }): Promise<TeachSession> {
    return this.request<TeachSession>("/api/sessions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/sessions/:id */
  getSession(id: string): Promise<TeachSession> {
    return this.request<TeachSession>(`/api/sessions/${encodeURIComponent(id)}`, { method: "GET" });
  },

  /** POST /api/sessions/:id/explanation */
  submitExplanation(
    sessionId: string,
    payload: { explanation: string; speechTranscribed?: boolean; durationSeconds?: number }
  ): Promise<{ success: boolean; wordCount: number; receivedAt: string }> {
    return this.request<{ success: boolean; wordCount: number; receivedAt: string }>(
      `/api/sessions/${encodeURIComponent(sessionId)}/explanation`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** POST /api/sessions/:id/evaluate */
  evaluateSession(
    sessionId: string,
    payload: {
      explanation: string;
      difficulty: DifficultyLevel;
      initialConfidence: number;
    }
  ): Promise<EvaluationResult> {
    return this.request<EvaluationResult>(
      `/api/sessions/${encodeURIComponent(sessionId)}/evaluate`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** POST /api/sessions/:id/next-question */
  requestNextQuestion(
    sessionId: string,
    payload: { currentEvaluationId?: string; lastResponse?: string }
  ): Promise<{ nextQuestion: string; contextTip?: string }> {
    return this.request<{ nextQuestion: string; contextTip?: string }>(
      `/api/sessions/${encodeURIComponent(sessionId)}/next-question`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /** POST /api/quizzes */
  createQuiz(payload: { topicId: string; topicTitle: string; difficulty?: DifficultyLevel }): Promise<Quiz> {
    return this.request<Quiz>("/api/quizzes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** POST /api/quizzes/:id/attempt */
  submitQuizAttempt(quizId: string, payload: QuizAttemptPayload): Promise<QuizAttemptResult> {
    return this.request<QuizAttemptResult>(`/api/quizzes/${encodeURIComponent(quizId)}/attempt`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/progress */
  getProgress(): Promise<{
    overallMastery: number;
    totalTopicsStudied: number;
    streakDays: number;
    studyHoursThisMonth: number;
    masteryByDifficulty: Record<DifficultyLevel, number>;
  }> {
    return this.request("/api/progress", { method: "GET" });
  },

  /** GET /api/knowledge-map */
  getKnowledgeMap(): Promise<KnowledgeMapData> {
    return this.request<KnowledgeMapData>("/api/knowledge-map", { method: "GET" });
  },

  /** GET /api/notes */
  getNotes(): Promise<StudyNote[]> {
    return this.request<StudyNote[]>("/api/notes", { method: "GET" });
  },

  /** POST /api/notes */
  saveNote(payload: Partial<StudyNote>): Promise<StudyNote> {
    return this.request<StudyNote>("/api/notes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/recommendations */
  getRecommendations(): Promise<Topic[]> {
    return this.request<Topic[]>("/api/recommendations", { method: "GET" });
  },

  /** POST /api/study-plans */
  createStudyPlan(payload: {
    title: string;
    targetExamOrGoal: string;
    weeklyHourTarget: number;
  }): Promise<StudyPlan> {
    return this.request<StudyPlan>("/api/study-plans", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** GET /api/analytics */
  getAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>("/api/analytics", { method: "GET" });
  },
};
