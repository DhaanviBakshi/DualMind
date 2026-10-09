"use client";

import * as React from "react";
import Link from "next/link";
import { apiClient, isMockModeEnabled } from "@/lib/api-client";
import { DashboardData } from "@/types/dualmind";
import {
  Brain,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CalendarCheck,
  BookOpen,
  Compass,
  Mic2,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

export default function DashboardPage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isMock, setIsMock] = React.useState(true);

  const fetchDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsMock(isMockModeEnabled());
      const res = await apiClient.getDashboard();
      setData(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchDashboard();
    const handleUpdate = () => fetchDashboard();
    window.addEventListener("dualmind_mock_mode_changed", handleUpdate);
    return () => window.removeEventListener("dualmind_mock_mode_changed", handleUpdate);
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-muted rounded-xl" />
          <div className="h-72 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Backend Connection Notice</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {error || "Could not retrieve dashboard data from the target backend."}
        </p>
        <p className="text-xs text-muted-foreground">
          System 1 does not fake successful API responses. You can switch to the development demo mock adapter using the banner above.
        </p>
        <Button onClick={fetchDashboard} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </Button>
      </div>
    );
  }

  const studyHours = (data.user.studyTimeMinutes / 60).toFixed(1);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {data.user.name}
            </h1>
            {isMock && (
              <Badge variant="indigo" className="text-[10px] px-2 py-0.5">
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Active recall rhythm: Day 14. Ready to teach your next concept?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/revision">
            <Button variant="outline" size="sm" className="gap-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              <span>Revision ({data.todaysRevisionDue.dueCount})</span>
            </Button>
          </Link>
          <Link href="/teach">
            <Button size="sm" className="gap-2 shadow-sm shadow-primary/25 text-xs font-semibold">
              <Mic2 className="w-3.5 h-3.5" />
              <span>Launch Teach Mode</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Vital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Mastery */}
        <Card className="hover:border-primary/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overall Mastery
            </CardTitle>
            <Brain className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">
              {data.user.overallMastery}%
            </div>
            <Progress value={data.user.overallMastery} className="mt-2" />
            <p className="text-[11px] text-muted-foreground mt-2">
              Based on active teaching & quiz retention
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Learning Streak */}
        <Card className="hover:border-amber-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Streak
            </CardTitle>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground flex items-baseline gap-1.5">
              <span>{data.user.streakDays}</span>
              <span className="text-xs font-normal text-muted-foreground">days</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Goal achieved today
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Total Study Time */}
        <Card className="hover:border-indigo-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Study Investment
            </CardTitle>
            <Clock className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground flex items-baseline gap-1.5">
              <span>{studyHours}</span>
              <span className="text-xs font-normal text-muted-foreground">hours</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              {data.user.studyTimeMinutes} min active cognitive time
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Topics Mastered */}
        <Card className="hover:border-emerald-400/40 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Topics Mastered
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground flex items-baseline gap-1.5">
              <span>{data.user.topicsMasteredCount}</span>
              <span className="text-xs font-normal text-muted-foreground">concepts</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Verified through Feynman evaluation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Knowledge Gaps Alert Banner */}
      {data.criticalKnowledgeGaps.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-300/60 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                Critical Knowledge Gap Detected
              </div>
              <div className="text-sm font-semibold text-foreground mt-0.5">
                {data.criticalKnowledgeGaps[0].topicTitle}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {data.criticalKnowledgeGaps[0].gapDescription}
              </div>
            </div>
          </div>
          <Link href={`/teach?topic=${data.criticalKnowledgeGaps[0].topicId}&mode=repair`}>
            <Button size="sm" variant="outline" className="border-amber-300 dark:border-amber-700 bg-background text-xs font-semibold shrink-0 gap-1.5">
              <span>Repair Gap in Teach Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Main Grid: Mastery Progression & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Weekly Mastery & Recent Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Mastery Trend Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold">Mastery Trajectory</CardTitle>
                <CardDescription className="text-xs">
                  Daily active learning mastery score over the past 7 days
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>+6% this week</span>
              </div>
            </CardHeader>
            <CardContent>
              {/* Responsive SVG Sparkline Chart */}
              <div className="h-44 w-full flex items-end gap-3 pt-6 pb-2 border-b border-border">
                {data.weeklyMasterySparkline.map((item, idx) => {
                  const heightPercent = Math.max(15, item.score);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] font-mono font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.score}%
                      </div>
                      <div className="w-full bg-muted/60 rounded-t-md h-32 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-primary group-hover:bg-primary/80 transition-all rounded-t-md"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Learning Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Recent Learning Sessions</CardTitle>
                <CardDescription className="text-xs">
                  Your latest Feynman explanations and evaluated scores
                </CardDescription>
              </div>
              <Link href="/analytics" className="text-xs text-primary font-semibold hover:underline">
                View all analytics →
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {data.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {session.topicTitle}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{session.subjectTitle}</span>
                        <span>•</span>
                        <span>{session.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="capitalize text-[11px]">
                        {session.difficulty}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-primary">
                          {session.score}/100
                        </div>
                        <div className="text-[10px] text-muted-foreground">Score</div>
                      </div>
                      <Link href={`/teach/feedback?session=${session.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 col): Recommended Topics & Revision Queue */}
        <div className="space-y-6">
          {/* Today's Spaced Revision Queue */}
          <Card className="border-indigo-200/50 dark:border-indigo-900/50 bg-gradient-to-br from-card to-indigo-50/20 dark:to-indigo-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  Today&apos;s Revision
                </CardTitle>
                <Badge variant="indigo" className="text-[10px]">
                  {data.todaysRevisionDue.dueCount} cards
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Estimated time: ~{data.todaysRevisionDue.estimatedMinutes} mins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.todaysRevisionDue.urgentCards.slice(0, 2).map((card) => (
                <div key={card.id} className="p-3 rounded-lg bg-card border border-border text-xs space-y-1">
                  <div className="font-semibold text-foreground">{card.topicTitle}</div>
                  <div className="text-muted-foreground line-clamp-1 italic">
                    &ldquo;{card.prompt}&rdquo;
                  </div>
                </div>
              ))}
              <Link href="/revision" className="block pt-1">
                <Button className="w-full text-xs font-semibold gap-1.5 shadow-sm">
                  <span>Start Spaced Repetition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recommended Next Topics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Recommended Next
              </CardTitle>
              <CardDescription className="text-xs">
                Personalized concepts ready for active teaching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recommendedTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-3 rounded-lg border border-border hover:border-primary/40 transition-colors flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        {topic.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        ~{topic.estimatedMinutes}m
                      </span>
                    </div>
                    {topic.recommendedReason && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                        {topic.recommendedReason}
                      </p>
                    )}
                  </div>
                  <Link href={`/teach?topic=${topic.id}`} className="self-end">
                    <Button variant="subtle" size="sm" className="h-7 px-2.5 text-[11px] gap-1">
                      <span>Teach Now</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
