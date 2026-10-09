"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Quiz, QuizAttemptResult, Topic } from "@/types/dualmind";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BookOpen,
  Award,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function QuizContent() {
  const searchParams = useSearchParams();
  const topicIdParam = searchParams.get("topic") || "top-attention-mech";

  const [quiz, setQuiz] = React.useState<Quiz | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = React.useState<QuizAttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    async function initQuiz() {
      try {
        setLoading(true);
        const res = await apiClient.createQuiz({
          topicId: topicIdParam,
          topicTitle: "Self-Attention Mechanism",
        });
        setQuiz(res);
      } finally {
        setLoading(false);
      }
    }
    initQuiz();
  }, [topicIdParam]);

  const handleSelect = (qId: string, optIdx: number) => {
    if (quizResult) return; // locked after submission
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setIsSubmitting(true);
    try {
      const answers = quiz.questions.map((q) => ({
        questionId: q.id,
        selectedOptionIndex: selectedAnswers[q.id] ?? 0,
      }));
      const res = await apiClient.submitQuizAttempt(quiz.id, { answers });
      setQuizResult(res);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setQuizResult(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">Adaptive Verification</Badge>
            <span className="text-xs text-muted-foreground">{quiz.questions.length} Questions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            {quiz.topicTitle} Quiz
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Test and prove durable conceptual retention.
          </p>
        </div>

        {quizResult ? (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Standard Pacing</span>
          </div>
        )}
      </div>

      {/* Quiz Result Summary Banner (if submitted) */}
      {quizResult && (
        <Card className="border-primary/30 bg-primary/5 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg font-mono">
                  {quizResult.score}%
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    Quiz Completed: {quizResult.correctCount} of {quizResult.totalQuestions} Correct
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {quizResult.feedback}
                  </p>
                </div>
              </div>
              <Badge variant="success" className="text-xs px-3 py-1">
                +{quizResult.masteryGained}% Verified Mastery
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Stack */}
      <div className="space-y-6">
        {quiz.questions.map((q, qIdx) => {
          const userSelected = selectedAnswers[q.id];
          const review = quizResult?.reviewItems.find((r) => r.questionId === q.id);

          return (
            <Card key={q.id} className="border-border">
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-primary">Question {qIdx + 1}</span>
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {q.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold leading-relaxed">
                  {q.prompt}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-1">
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userSelected === optIdx;
                    const isCorrect = q.correctOptionIndex === optIdx;
                    const showResult = Boolean(quizResult);

                    let btnClass = "border-border hover:bg-muted/50 text-foreground";
                    if (isSelected) {
                      btnClass = "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30";
                    }
                    if (showResult) {
                      if (isCorrect) {
                        btnClass = "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={Boolean(quizResult)}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full p-3.5 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {showResult ? (
                          isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                          ) : isSelected ? (
                            <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                          ) : null
                        ) : isSelected ? (
                          <Check className="w-4 h-4 text-primary shrink-0 ml-2" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation accordion if quiz completed */}
                {quizResult && (
                  <div className="mt-4 p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs space-y-1">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      Conceptual Explanation:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Link href="/learn">
          <Button variant="outline" size="sm">
            Curriculum Catalog
          </Button>
        </Link>

        {quizResult ? (
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5 shadow-md">
              <span>Return to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="gap-1.5 shadow-md font-semibold"
          >
            <span>Submit Quiz</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          Loading Adaptive Quiz...
        </div>
      }
    >
      <QuizContent />
    </React.Suspense>
  );
}
