"use client";

import * as React from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { StudyPlan, StudyPlanItem } from "@/types/dualmind";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Plus,
  Sparkles,
  Layers,
  RotateCcw,
  Mic2,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

export default function StudyPlanPage() {
  const [plan, setPlan] = React.useState<StudyPlan | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiClient.createStudyPlan({
          title: "Fall Technical Mastery & Active Recall",
          targetExamOrGoal: "Staff Level Conceptual Rigor",
          weeklyHourTarget: 10,
        });
        setPlan(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggleTask = (itemId: string) => {
    if (!plan) return;
    const updatedItems = plan.items.map((it) =>
      it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it
    );
    setPlan({ ...plan, items: updatedItems });
  };

  if (loading || !plan) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-72 bg-muted rounded-xl" />
      </div>
    );
  }

  const completedCount = plan.items.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / plan.items.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <CalendarCheck className="w-7 h-7 text-primary" />
            Active Learning Study Plan
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Goal: <strong>{plan.targetExamOrGoal}</strong> • {plan.weeklyHourTarget} hours weekly pacing
          </p>
        </div>

        <Badge variant="success" className="text-xs px-3 py-1 font-semibold uppercase tracking-wider">
          Pace: {plan.paceStatus}
        </Badge>
      </div>

      {/* Weekly Progress Banner Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="text-center md:border-r md:border-border pr-0 md:pr-6 space-y-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Weekly Target</span>
              <div className="text-3xl font-extrabold font-mono text-primary">
                {plan.currentWeeklyHours} / {plan.weeklyHourTarget}h
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                45% completed
              </span>
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>Weekly Task Completion ({completedCount} of {plan.items.length} tasks)</span>
                <span className="font-mono text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} />
              <p className="text-xs text-muted-foreground">
                Spreading small active recall sessions across weekdays boosts long-term synaptic retention by 3.8x compared to weekend cramming.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Tasks List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-foreground">This Week&apos;s Active Tasks</h3>

        <div className="space-y-3">
          {plan.items.map((item) => {
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.isCompleted
                    ? "border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10"
                    : "border-border bg-card shadow-sm hover:border-primary/40"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => handleToggleTask(item.id)}
                    className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors mt-0.5 sm:mt-0 ${
                      item.isCompleted
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-input hover:border-primary"
                    }`}
                  >
                    {item.isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {item.dayOfWeek}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.subjectTitle}</span>
                    </div>
                    <h4
                      className={`font-semibold text-sm mt-1 ${
                        item.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.topicTitle}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <Badge variant="outline" className="text-xs gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.allocatedMinutes} min</span>
                  </Badge>

                  <Badge variant="indigo" className="text-xs">
                    {item.targetTask}
                  </Badge>

                  <Link href={`/teach?topic=${item.topicId}`}>
                    <Button size="sm" variant={item.isCompleted ? "ghost" : "default"} className="h-8 text-xs gap-1">
                      <span>Launch</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
