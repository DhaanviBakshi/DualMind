/**
 * DUALMIND — Type Definitions & Integration Contracts
 * System 1: Frontend & UI
 * 
 * Shared contracts coordinating with:
 * - System 2: AI Learning Engine
 * - System 3: Backend & Database
 */

export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  currentStreakDays: number;
  totalStudyHours: number;
  totalTopicsMastered: number;
  overallMasteryScore: number; // 0-100
  targetDiscipline: string;
  preferredAIStyle: "socratic" | "supportive" | "rigorous" | "curious";
  dailyGoalMinutes: number;
  voiceInputEnabled: boolean;
  createdAt: string;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  totalTopics: number;
  masteredTopics: number;
  difficultyRange: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  subjectTitle: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  prerequisites: string[];
  tags: string[];
  masteryScore?: number; // 0-100
  lastStudiedAt?: string;
  status: "not-started" | "in-progress" | "mastered" | "needs-review";
  recommendedReason?: string;
}

/**
 * Core Evaluation Contract specified by System 1/2/3 integration agreement.
 */
export interface EvaluationResult {
  score: number;
  accuracy: number;
  completeness: number;
  clarity: number;
  understanding: number;
  strengths: string[];
  knowledgeGaps: string[];
  misconceptions: string[];
  difficulty: DifficultyLevel;
  feedback: string;
  nextQuestion: string;
}

export interface TeachSession {
  id: string;
  userId: string;
  subjectId: string;
  subjectTitle: string;
  topicId: string;
  topicTitle: string;
  difficulty: DifficultyLevel;
  initialConfidence: number; // 0-100
  userExplanation?: string;
  audioDurationSeconds?: number;
  evaluation?: EvaluationResult;
  gapRepairNotes?: string;
  reTeachExplanation?: string;
  quizId?: string;
  quizScore?: number;
  previousMastery?: number;
  newMastery?: number;
  status: "draft" | "explaining" | "evaluating" | "repairing" | "quizzing" | "completed";
  createdAt: string;
  completedAt?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  relatedConcept: string;
  difficulty: DifficultyLevel;
}

export interface Quiz {
  id: string;
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
}

export interface QuizAttemptPayload {
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    timeSpentSeconds?: number;
  }[];
}

export interface QuizAttemptResult {
  quizId: string;
  score: number; // 0-100
  correctCount: number;
  totalQuestions: number;
  reviewItems: {
    questionId: string;
    isCorrect: boolean;
    selectedOptionIndex: number;
    correctOptionIndex: number;
    explanation: string;
  }[];
  masteryGained: number;
  feedback: string;
}

export interface KnowledgeNode {
  id: string;
  label: string;
  subject: string;
  difficulty: DifficultyLevel;
  status: "mastered" | "in-progress" | "needs-review" | "locked";
  masteryLevel: number; // 0-100
  prerequisites: string[]; // node IDs
  x?: number;
  y?: number;
  summary: string;
}

export interface KnowledgeMapData {
  nodes: KnowledgeNode[];
  edges: {
    from: string;
    to: string;
    type: "prerequisite" | "synergy" | "application";
  }[];
  subjectFilters: string[];
}

export interface StudyNote {
  id: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  title: string;
  summary: string;
  content: string; // Markdown
  feynmanBreakdown: {
    simpleAnalogy: string;
    coreDefinition: string;
    commonPitfall: string;
  };
  tags: string[];
  flashcardCount: number;
  updatedAt: string;
}

export interface RevisionCard {
  id: string;
  topicId: string;
  topicTitle: string;
  prompt: string;
  answer: string;
  analogyTip?: string;
  intervalDays: number;
  repetitionCount: number;
  easeFactor: number;
  dueDate: string;
  lastConfidenceRating?: "again" | "hard" | "good" | "easy";
}

export interface StudyPlanItem {
  id: string;
  dayOfWeek: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  date: string;
  topicId: string;
  topicTitle: string;
  subjectTitle: string;
  allocatedMinutes: number;
  targetTask: "Teach" | "Revision" | "Deep Quiz" | "Review Gap";
  isCompleted: boolean;
}

export interface StudyPlan {
  id: string;
  title: string;
  targetExamOrGoal: string;
  weeklyHourTarget: number;
  currentWeeklyHours: number;
  items: StudyPlanItem[];
  paceStatus: "on-track" | "ahead" | "needs-attention";
}

export interface AchievementBadge {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  category: "mastery" | "streak" | "voice" | "feynman" | "grit";
  unlockedAt?: string;
  progressPercent: number;
  isUnlocked: boolean;
}

export interface AnalyticsData {
  masteryTimeline: {
    date: string;
    masteryScore: number;
    sessionsCount: number;
  }[];
  cognitiveDimensions: {
    dimension: "Accuracy" | "Completeness" | "Clarity" | "Understanding" | "Retention";
    currentScore: number;
    benchmarkScore: number;
  }[];
  studyTimeBySubject: {
    subject: string;
    hours: number;
    percentage: number;
  }[];
  misconceptionsByCategory: {
    category: string;
    count: number;
    resolvedCount: number;
  }[];
  weeklyActivity: {
    day: string;
    minutes: number;
    sessions: number;
  }[];
}

export interface DashboardData {
  user: {
    name: string;
    avatarUrl?: string;
    streakDays: number;
    overallMastery: number;
    studyTimeMinutes: number;
    topicsMasteredCount: number;
  };
  criticalKnowledgeGaps: {
    topicId: string;
    topicTitle: string;
    gapDescription: string;
    urgency: "high" | "medium";
  }[];
  recentSessions: {
    id: string;
    topicTitle: string;
    subjectTitle: string;
    date: string;
    score: number;
    difficulty: DifficultyLevel;
  }[];
  recommendedTopics: Topic[];
  todaysRevisionDue: {
    dueCount: number;
    estimatedMinutes: number;
    urgentCards: RevisionCard[];
  };
  studyPlanOverview: {
    paceStatus: "on-track" | "ahead" | "needs-attention";
    completedTasksToday: number;
    totalTasksToday: number;
    nextUp: StudyPlanItem;
  };
  weeklyMasterySparkline: {
    day: string;
    score: number;
  }[];
}
