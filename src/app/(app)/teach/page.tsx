"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  DifficultyLevel,
  EvaluationResult,
  Quiz,
  QuizAttemptResult,
  TeachSession,
  Topic,
} from "@/types/dualmind";
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Brain,
  RotateCcw,
  BookOpen,
  Award,
  Clock,
  Layers,
  ChevronRight,
  Check,
  Send,
  Loader2,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Slider } from "@/components/ui/Slider";
import { Textarea } from "@/components/ui/Textarea";
import { Progress } from "@/components/ui/Progress";

// Workflow Stages
type TeachStage =
  | "select"
  | "confidence"
  | "explain"
  | "evaluating"
  | "evaluation"
  | "repair"
  | "quiz"
  | "results";

function TeachModeContent() {
  const searchParams = useSearchParams();
  const initialTopicParam = searchParams.get("topic");

  // State Management
  const [stage, setStage] = React.useState<TeachStage>("select");
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [difficulty, setDifficulty] = React.useState<DifficultyLevel>("intermediate");
  const [confidence, setConfidence] = React.useState<number>(65);

  // Explanation Input & Voice Dictation
  const [explanation, setExplanation] = React.useState<string>("");
  const [isListening, setIsListening] = React.useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = React.useState<boolean>(true);
  const [speechError, setSpeechError] = React.useState<string | null>(null);
  const recognitionRef = React.useRef<any>(null);

  // Session & AI Output
  const [session, setSession] = React.useState<TeachSession | null>(null);
  const [evaluation, setEvaluation] = React.useState<EvaluationResult | null>(null);
  const [repairAnswer, setRepairAnswer] = React.useState<string>("");
  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = React.useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = React.useState<QuizAttemptResult | null>(null);
  const [loadingAction, setLoadingAction] = React.useState<boolean>(false);

  // Load available topics
  React.useEffect(() => {
    async function load() {
      try {
        const list = await apiClient.getTopics();
        setTopics(list);
        if (initialTopicParam) {
          const match = list.find((t) => t.id === initialTopicParam);
          if (match) {
            setSelectedTopic(match);
            setDifficulty(match.difficulty);
            setStage("confidence");
          }
        }
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    }
    load();
  }, [initialTopicParam]);

  // Web Speech API Initialization
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setExplanation(currentTranscript.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e.error);
          setSpeechError(
            e.error === "not-allowed"
              ? "Microphone access was denied. Please allow microphone permissions or use text input."
              : `Speech recognition notice: ${e.error}. Falling back to text mode.`
          );
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!speechSupported || !recognitionRef.current) {
      setSpeechError("Browser speech recognition is not supported in this browser. Please type your explanation below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setSpeechError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Start speech failed:", err);
        setIsListening(false);
      }
    }
  };

  // Actions
  const handleSelectTopic = (t: Topic) => {
    setSelectedTopic(t);
    setDifficulty(t.difficulty);
    setStage("confidence");
  };

  const handleStartExplaining = async () => {
    if (!selectedTopic) return;
    setLoadingAction(true);
    try {
      const newSession = await apiClient.createSession({
        subjectId: selectedTopic.subjectId,
        subjectTitle: selectedTopic.subjectTitle,
        topicId: selectedTopic.id,
        topicTitle: selectedTopic.title,
        difficulty,
        initialConfidence: confidence,
      });
      setSession(newSession);
      setStage("explain");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSubmitExplanation = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setStage("evaluating");
    try {
      const sessionId = session?.id || "sess-demo";
      const evalResult = await apiClient.evaluateSession(sessionId, {
        explanation,
        difficulty,
        initialConfidence: confidence,
      });
      setEvaluation(evalResult);
      setStage("evaluation");
    } catch (err) {
      console.error("Evaluation error:", err);
      setStage("explain");
    }
  };

  const handleProceedToRepair = () => {
    setStage("repair");
  };

  const handleProceedToQuiz = async () => {
    if (!selectedTopic) return;
    setLoadingAction(true);
    try {
      const q = await apiClient.createQuiz({
        topicId: selectedTopic.id,
        topicTitle: selectedTopic.title,
        difficulty,
      });
      setQuiz(q);
      setStage("quiz");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setLoadingAction(true);
    try {
      const answers = quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionIndex: selectedQuizAnswers[q.id] ?? 0,
      }));
      const result = await apiClient.submitQuizAttempt(quiz.id, { answers });
      setQuizResult(result);
      setStage("results");
    } finally {
      setLoadingAction(false);
    }
  };

  const wordCount = explanation.split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Workflow Progress Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">Teach Mode Studio</span>
          <span>•</span>
          <span className="capitalize">{stage}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {["select", "confidence", "explain", "evaluation", "repair", "quiz", "results"].map((s, idx) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-colors ${
                stage === s
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================
          STAGE 1: SELECT TOPIC
      ======================================================== */}
      {stage === "select" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Step 1 of 6</Badge>
              <CardTitle className="text-xl font-bold">Select Concept to Teach</CardTitle>
            </div>
            <CardDescription>
              Pick a topic from your curriculum or choose an active concept with detected gaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleSelectTopic(t)}
                  className="p-4 rounded-xl border border-border hover:border-primary cursor-pointer hover:bg-muted/40 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{t.subjectTitle}</span>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {t.difficulty}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {t.description}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                    <span>Est. {t.estimatedMinutes} mins</span>
                    {t.masteryScore !== undefined && (
                      <span className="font-mono font-medium">Mastery: {t.masteryScore}%</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================
          STAGE 2: DIFFICULTY & CONFIDENCE SLIDER
      ======================================================== */}
      {stage === "confidence" && selectedTopic && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Step 2 of 6</Badge>
              <CardTitle className="text-xl font-bold">Calibrate Socratic Difficulty</CardTitle>
            </div>
            <CardDescription>
              Target concept: <strong>{selectedTopic.title}</strong> ({selectedTopic.subjectTitle})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Select Teaching Difficulty
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(["beginner", "intermediate", "advanced", "expert"] as DifficultyLevel[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`p-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                      difficulty === d
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                        : "border-border hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Slider (0 - 100) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Rate Your Prior Confidence Before Teaching
                </label>
                <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {confidence}%
                </span>
              </div>
              <Slider
                value={confidence}
                min={0}
                max={100}
                onValueChange={setConfidence}
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>0% — Completely Unfamiliar</span>
                <span>50% — High-level Intuition</span>
                <span>100% — Full Formal Proof</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setStage("select")}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Change Topic
              </Button>
              <Button size="sm" onClick={handleStartExplaining} isLoading={loadingAction} className="gap-1.5 shadow-md">
                <span>Start Teaching Now</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================
          STAGE 3: EXPLAIN CONCEPT (TEXT + SPEECH DICTATION)
      ======================================================== */}
      {stage === "explain" && selectedTopic && (
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="indigo">Step 3 of 6</Badge>
                <CardTitle className="text-xl font-bold">Teach the Concept</CardTitle>
              </div>
              <Badge variant="outline" className="capitalize text-xs">
                {difficulty}
              </Badge>
            </div>
            <CardDescription>
              Explain <strong>{selectedTopic.title}</strong> in your own words. Use analogies and avoid unearned jargon.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Speech-to-text fallback / status banner */}
            {speechError && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{speechError}</span>
              </div>
            )}

            {/* Voice Dictation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                  aria-label={isListening ? "Stop Recording" : "Start Voice Dictation"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    {isListening ? "Listening to your explanation..." : "Browser Voice Dictation"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {isListening
                      ? "Speak clearly. Dictation converts speech in real time."
                      : speechSupported
                      ? "Click microphone to dictate verbally or type below."
                      : "Voice input not supported in this browser. Text input active."}
                  </div>
                </div>
              </div>

              {/* Live Audio Waves (Animated) */}
              {isListening && (
                <div className="flex items-center gap-1 h-6 px-3">
                  <div className="w-1 bg-rose-500 rounded animate-wave h-4" />
                  <div className="w-1 bg-rose-500 rounded animate-wave h-6 delay-75" />
                  <div className="w-1 bg-rose-500 rounded animate-wave h-3 delay-150" />
                  <div className="w-1 bg-rose-500 rounded animate-wave h-5 delay-200" />
                </div>
              )}
            </div>

            {/* Explanation Textarea */}
            <div className="space-y-1.5">
              <Textarea
                rows={9}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Start teaching... For example: 'Imagine self-attention like a library catalog where every token has a query, key, and value...'"
                className="font-sans text-sm leading-relaxed p-4 bg-background resize-y"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>{wordCount} words</span>
                <span>Minimum recommended: 30 words for reliable rubric scoring</span>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setStage("confidence")}>
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitExplanation}
                disabled={wordCount < 10}
                className="gap-2 shadow-md font-semibold"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit to AI Evaluator</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================
          STAGE 4: COGNITIVE ANALYSIS IN FLIGHT (EVALUATING)
      ======================================================== */}
      {stage === "evaluating" && (
        <Card className="text-center p-12 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto animate-bounce">
            <Brain className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">
              Evaluating Conceptual Depth...
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              System 2 is analyzing Accuracy, Completeness, Clarity, and Understanding across our verified knowledge taxonomy.
            </p>
          </div>
          <div className="max-w-xs mx-auto space-y-2 text-left text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Transcribing semantic tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Checking misconception database</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              <span>Synthesizing Socratic challenge</span>
            </div>
          </div>
        </Card>
      )}

      {/* ========================================================
          STAGE 5: EVALUATION SCORECARDS & RUBRIC
      ======================================================== */}
      {stage === "evaluation" && evaluation && (
        <div className="space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Badge variant="indigo" className="mb-2">Evaluation Results</Badge>
                  <CardTitle className="text-2xl font-bold">
                    Feynman Mastery Score: {evaluation.score} / 100
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Difficulty: <span className="capitalize font-semibold text-foreground">{evaluation.difficulty}</span>
                  </CardDescription>
                </div>
                <div className="text-3xl font-extrabold font-mono text-primary px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  {evaluation.score}%
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 4 Rubric Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">Accuracy</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {evaluation.accuracy}%
                  </div>
                  <Progress value={evaluation.accuracy} />
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">Completeness</span>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {evaluation.completeness}%
                  </div>
                  <Progress value={evaluation.completeness} />
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">Clarity</span>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {evaluation.clarity}%
                  </div>
                  <Progress value={evaluation.clarity} />
                </div>
                <div className="p-3.5 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground uppercase font-semibold">Understanding</span>
                  <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                    {evaluation.understanding}%
                  </div>
                  <Progress value={evaluation.understanding} />
                </div>
              </div>

              {/* AI Teacher Feedback Paragraph */}
              <div className="p-4 rounded-xl bg-muted/60 border border-border/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Teacher Synthesis
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {evaluation.feedback}
                </p>
              </div>

              {/* Strengths & Knowledge Gaps 2-column breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Conceptual Strengths
                  </div>
                  <ul className="space-y-2 text-xs text-foreground">
                    {evaluation.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Knowledge Gaps */}
                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Identified Knowledge Gaps
                  </div>
                  <ul className="space-y-2 text-xs text-foreground">
                    {evaluation.knowledgeGaps.map((gap, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Misconception Warnings (if any) */}
              {evaluation.misconceptions.length > 0 && (
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Misconception Warning
                  </div>
                  {evaluation.misconceptions.map((misc, idx) => (
                    <p key={idx} className="text-xs text-foreground">
                      {misc}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button variant="outline" size="sm" onClick={() => setStage("explain")}>
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Refine Explanation
                </Button>
                <Button size="sm" onClick={handleProceedToRepair} className="gap-1.5 shadow-md font-semibold">
                  <span>Repair Discovered Gaps</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================
          STAGE 6: REPAIR KNOWLEDGE GAP & RE-TEACH
      ======================================================== */}
      {stage === "repair" && evaluation && (
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Badge variant="indigo">Step 5 of 6</Badge>
              <CardTitle className="text-xl font-bold">Repair Knowledge Gap</CardTitle>
            </div>
            <CardDescription>
              Address the AI Teacher&apos;s Socratic probing question to resolve the identified gap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* The Socratic Question */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                Socratic Follow-Up Challenge
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                &ldquo;{evaluation.nextQuestion}&rdquo;
              </p>
            </div>

            {/* Student Gap Repair Answer */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Your Refined Answer & Re-teach
              </label>
              <Textarea
                rows={5}
                value={repairAnswer}
                onChange={(e) => setRepairAnswer(e.target.value)}
                placeholder="Explain the solution to the Socratic question..."
                className="text-sm bg-background resize-y"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setStage("evaluation")}>
                Back to Evaluation
              </Button>
              <Button
                size="sm"
                onClick={handleProceedToQuiz}
                isLoading={loadingAction}
                className="gap-1.5 shadow-md font-semibold"
              >
                <span>Take Adaptive Quiz</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================
          STAGE 7: INTERACTIVE ADAPTIVE MINI-QUIZ
      ======================================================== */}
      {stage === "quiz" && quiz && (
        <Card className="border-border shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="indigo">Step 6 of 6</Badge>
                <CardTitle className="text-xl font-bold">Adaptive Verification Quiz</CardTitle>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {quiz.questions.length} questions
              </span>
            </div>
            <CardDescription>
              Answer these targeted questions to test retention of the concepts you just taught.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {quiz.questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-primary font-mono">Q{qIdx + 1}</span>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {q.difficulty}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  {q.prompt}
                </h4>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedQuizAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectQuizOption(q.id, optIdx)}
                        className={`w-full p-3 rounded-lg text-left text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground font-semibold ring-1 ring-primary/40"
                            : "border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setStage("repair")}>
                Back to Repair
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitQuiz}
                isLoading={loadingAction}
                className="gap-1.5 shadow-md font-semibold"
              >
                <span>Submit & Calculate Mastery</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================
          STAGE 8: FINAL SESSION RESULTS & MASTERY DELTA
      ======================================================== */}
      {stage === "results" && quizResult && selectedTopic && (
        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-4 space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold">Session Completed!</CardTitle>
            <CardDescription>
              You successfully explained, repaired, and proved mastery for <strong>{selectedTopic.title}</strong>.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Mastery Gain Metric Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center space-y-3">
              <div className="text-xs uppercase font-bold text-primary tracking-wider">
                Overall Topic Mastery Delta
              </div>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <div className="text-xs text-muted-foreground">Previous</div>
                  <div className="text-2xl font-bold font-mono text-muted-foreground">
                    {confidence}%
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-primary" />
                <div>
                  <div className="text-xs text-primary font-semibold">Verified Mastery</div>
                  <div className="text-3xl font-extrabold font-mono text-primary">
                    {Math.min(98, confidence + quizResult.masteryGained)}%
                  </div>
                </div>
              </div>
              <div className="inline-block text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                +{quizResult.masteryGained}% durable retention gained
              </div>
            </div>

            {/* Quiz Performance Review */}
            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">Adaptive Quiz Score</span>
                <span className="font-bold font-mono text-primary">
                  {quizResult.correctCount} / {quizResult.totalQuestions} correct ({quizResult.score}%)
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {quizResult.feedback}
              </p>
            </div>

            {/* Next Steps CTA Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link href="/notes" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-10">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Save to Notes</span>
                </Button>
              </Link>
              <Link href="/knowledge-map" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 h-10">
                  <Brain className="w-3.5 h-3.5" />
                  <span>View Knowledge Map</span>
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full">
                <Button size="sm" className="w-full text-xs gap-1.5 h-10 shadow-md">
                  <span>Return to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TeachModePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          Loading Teach Mode Studio...
        </div>
      }
    >
      <TeachModeContent />
    </React.Suspense>
  );
}
