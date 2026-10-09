"use client";

import * as React from "react";
import { AchievementBadge } from "@/types/dualmind";
import {
  Award,
  Flame,
  Mic,
  Brain,
  ShieldCheck,
  Zap,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

const BADGES: AchievementBadge[] = [
  {
    id: "badge-1",
    title: "Feynman Apprentice",
    tagline: "First Steps in Active Teaching",
    description: "Successfully explain 5 concepts without using unearned jargon.",
    icon: "Brain",
    category: "feynman",
    unlockedAt: "3 days ago",
    progressPercent: 100,
    isUnlocked: true,
  },
  {
    id: "badge-2",
    title: "Misconception Slayer",
    tagline: "Cognitive Humility & Repair",
    description: "Repair 10 false assumptions flagged by the AI Socratic engine.",
    icon: "ShieldCheck",
    category: "mastery",
    unlockedAt: "Yesterday",
    progressPercent: 100,
    isUnlocked: true,
  },
  {
    id: "badge-3",
    title: "14-Day Streak Master",
    tagline: "Unbreakable Synaptic Habit",
    description: "Complete an active recall session 14 consecutive days in a row.",
    icon: "Flame",
    category: "streak",
    unlockedAt: "Today",
    progressPercent: 100,
    isUnlocked: true,
  },
  {
    id: "badge-4",
    title: "Vocal Explainer",
    tagline: "Lecture Hall Orator",
    description: "Dictate at least 30 minutes of spoken explanations using Web Speech API.",
    icon: "Mic",
    category: "voice",
    progressPercent: 70,
    isUnlocked: false,
  },
  {
    id: "badge-5",
    title: "Rubric Perfectionist",
    tagline: "Master-Grade Clarity",
    description: "Achieve 90%+ simultaneously across Accuracy, Completeness, Clarity, and Understanding.",
    icon: "Zap",
    category: "mastery",
    progressPercent: 84,
    isUnlocked: false,
  },
  {
    id: "badge-6",
    title: "Socratic Sparrer",
    tagline: "Unwavering Under Fire",
    description: "Defend your thesis across 25 consecutive Socratic follow-up challenges.",
    icon: "Award",
    category: "feynman",
    progressPercent: 50,
    isUnlocked: false,
  },
];

export default function AchievementsPage() {
  const [filter, setFilter] = React.useState<string>("all");

  const filteredBadges = BADGES.filter(
    (b) => filter === "all" || b.category === filter
  );

  const unlockedCount = BADGES.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Award className="w-7 h-7 text-primary" />
            Achievements & Active Badges
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rewards for genuine cognitive effort, teaching rigor, and misconception remediation.
          </p>
        </div>

        <Badge variant="indigo" className="text-xs px-3 py-1 font-semibold">
          {unlockedCount} of {BADGES.length} Badges Unlocked
        </Badge>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["all", "feynman", "mastery", "streak", "voice"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              filter === cat
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat === "all" ? "All Badges" : cat}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          return (
            <Card
              key={badge.id}
              className={`flex flex-col justify-between transition-all ${
                badge.isUnlocked
                  ? "border-primary/40 bg-card shadow-sm hover:border-primary"
                  : "border-border/60 bg-muted/20 opacity-80"
              }`}
            >
              <CardHeader className="space-y-3 pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      badge.isUnlocked
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {badge.isUnlocked ? (
                      <Award className="w-6 h-6" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  {badge.isUnlocked ? (
                    <Badge variant="success" className="text-[10px]">
                      Unlocked {badge.unlockedAt}
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                      {badge.progressPercent}%
                    </span>
                  )}
                </div>

                <div>
                  <CardTitle className="text-base font-bold">{badge.title}</CardTitle>
                  <div className="text-xs font-semibold text-primary mt-0.5">
                    {badge.tagline}
                  </div>
                  <CardDescription className="text-xs mt-1.5 leading-relaxed">
                    {badge.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Progress</span>
                    <span>{badge.progressPercent}%</span>
                  </div>
                  <Progress value={badge.progressPercent} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
