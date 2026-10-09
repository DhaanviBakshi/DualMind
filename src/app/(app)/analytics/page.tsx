"use client";

import * as React from "react";
import { apiClient } from "@/lib/api-client";
import { AnalyticsData } from "@/types/dualmind";
import {
  BarChart3,
  TrendingUp,
  Brain,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export default function AnalyticsPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiClient.getAnalytics();
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-muted rounded-xl" />
          <div className="h-72 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-primary" />
          Active Learning Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cognitive rubric trends, misconception remediation, and subject time distribution.
        </p>
      </div>

      {/* Grid 1: Mastery Growth Curve & 4D Cognitive Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Mastery Trajectory (Past 30 Days)
              </CardTitle>
              <Badge variant="success" className="text-[10px]">+32% Growth</Badge>
            </div>
            <CardDescription className="text-xs">
              Aggregate Feynman evaluation scores plotted across weekly intervals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 w-full flex items-end gap-4 pt-6 pb-2 border-b border-border">
              {data.masteryTimeline.map((item, idx) => {
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.masteryScore}%
                    </span>
                    <div className="w-full bg-muted/50 rounded-t-lg h-36 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-primary/80 group-hover:bg-primary transition-all rounded-t-lg"
                        style={{ height: `${item.masteryScore}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 4D Cognitive Rubric Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Cognitive Dimension Profile
              </CardTitle>
              <span className="text-xs text-muted-foreground">vs Benchmark</span>
            </div>
            <CardDescription className="text-xs">
              Your average score compared to the 70% passing threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            {data.cognitiveDimensions.map((dim) => (
              <div key={dim.dimension} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{dim.dimension}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[10px]">
                      Benchmark: {dim.benchmarkScore}%
                    </span>
                    <span className="font-mono font-bold text-primary">{dim.currentScore}%</span>
                  </div>
                </div>
                <Progress value={dim.currentScore} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Grid 2: Subject Distribution & Misconceptions Remediated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Time Invested by Subject
            </CardTitle>
            <CardDescription className="text-xs">
              Active verbal and written explanation time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.studyTimeBySubject.map((subj) => (
              <div key={subj.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{subj.subject}</span>
                  <span className="text-muted-foreground font-mono">
                    {subj.hours} hrs ({subj.percentage}%)
                  </span>
                </div>
                <Progress value={subj.percentage} indicatorColor="bg-indigo-500" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Misconceptions Remediation Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Misconceptions Remediation
            </CardTitle>
            <CardDescription className="text-xs">
              Common thinking traps detected and repaired during teaching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.misconceptionsByCategory.map((misc) => {
              const resolvePercent = Math.round((misc.resolvedCount / misc.count) * 100);
              return (
                <div key={misc.category} className="p-3 rounded-xl border border-border bg-card space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{misc.category}</span>
                    <Badge variant="success" className="text-[10px]">
                      {misc.resolvedCount} of {misc.count} repaired
                    </Badge>
                  </div>
                  <Progress value={resolvePercent} indicatorColor="bg-emerald-500" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
