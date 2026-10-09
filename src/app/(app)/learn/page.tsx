"use client";

import * as React from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { DifficultyLevel, Topic } from "@/types/dualmind";
import {
  Compass,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Brain,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";

export default function LearnPage() {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSubject, setSelectedSubject] = React.useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("All");

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiClient.getTopics();
        setTopics(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const subjects = ["All", ...Array.from(new Set(topics.map((t) => t.subjectTitle)))];

  const filteredTopics = topics.filter((t) => {
    const matchesSubject = selectedSubject === "All" || t.subjectTitle === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "All" || t.difficulty === selectedDifficulty;
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesDifficulty && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Compass className="w-7 h-7 text-primary" />
            Curriculum & Concept Catalog
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse verified knowledge modules. Select any concept to anchor your Feynman explanation.
          </p>
        </div>

        <Link href="/knowledge-map">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span>Interactive Knowledge Graph</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search concepts, tags, or prerequisites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              aria-label="Filter by difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider shrink-0">
            Subject:
          </span>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedSubject === subj
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Topics */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 bg-muted/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-foreground">No concepts found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query or selecting a different subject filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic) => {
            const isMastered = (topic.masteryScore ?? 0) >= 85;
            const hasGaps = topic.status === "needs-review";

            return (
              <Card
                key={topic.id}
                className="flex flex-col justify-between hover:border-primary/50 transition-all hover:shadow-md group"
              >
                <CardHeader className="pb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-primary">
                      {topic.subjectTitle}
                    </span>
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold group-hover:text-primary transition-colors">
                    {topic.title}
                  </CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {topic.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Mastery Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground flex items-center gap-1">
                        {isMastered ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        ) : hasGaps ? (
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <span>{hasGaps ? "Gap Detected" : isMastered ? "Mastered" : "Active"}</span>
                      </span>
                      <span className="font-mono font-semibold text-foreground">
                        {topic.masteryScore ?? 0}%
                      </span>
                    </div>
                    <Progress value={topic.masteryScore ?? 0} />
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2 border-t border-border">
                    <Link href={`/teach?topic=${topic.id}`} className="flex-1">
                      <Button size="sm" className="w-full text-xs gap-1.5 font-semibold">
                        <span>Teach This</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Link href={`/quiz?topic=${topic.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs" title="Take Adaptive Quiz">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
