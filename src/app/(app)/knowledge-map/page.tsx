"use client";

import * as React from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { KnowledgeMapData, KnowledgeNode } from "@/types/dualmind";
import {
  Network,
  Search,
  Filter,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

export default function KnowledgeMapPage() {
  const [mapData, setMapData] = React.useState<KnowledgeMapData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedSubject, setSelectedSubject] = React.useState("All");
  const [activeNode, setActiveNode] = React.useState<KnowledgeNode | null>(null);

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiClient.getKnowledgeMap();
        setMapData(data);
        if (data.nodes.length > 0) {
          setActiveNode(data.nodes[3]); // default to Self-Attention
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !mapData) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded-lg" />
        <div className="h-96 bg-muted rounded-xl" />
      </div>
    );
  }

  const filteredNodes = mapData.nodes.filter(
    (n) => selectedSubject === "All" || n.subject === selectedSubject
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Network className="w-7 h-7 text-primary" />
            Curriculum Knowledge Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visual dependency graph of concepts, prerequisite links, and active mastery states.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-muted/60 px-3 py-1.5 rounded-lg border border-border">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Mastered (85%+)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span>In-Progress</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Gap Detected</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Locked</span>
          </span>
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {mapData.subjectFilters.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              selectedSubject === s
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Interactive Visual Graph & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Canvas (2 cols) */}
        <div className="lg:col-span-2 border border-border rounded-xl bg-card p-6 min-h-[460px] relative overflow-hidden shadow-sm flex flex-col justify-between">
          <div className="absolute top-4 right-4 text-[11px] text-muted-foreground bg-muted/80 px-2.5 py-1 rounded-md border border-border">
            Interactive Node Topology
          </div>

          {/* Conceptual Node Graph Rendering */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-auto py-4">
            {filteredNodes.map((node) => {
              const isSelected = activeNode?.id === node.id;
              let statusBorder = "border-border";
              let statusBg = "bg-card";
              let statusText = "text-muted-foreground";

              if (node.status === "mastered") {
                statusBorder = "border-emerald-500/40";
                statusBg = "bg-emerald-50/30 dark:bg-emerald-950/20";
                statusText = "text-emerald-600 dark:text-emerald-400";
              } else if (node.status === "needs-review") {
                statusBorder = "border-amber-500/40";
                statusBg = "bg-amber-50/30 dark:bg-amber-950/20";
                statusText = "text-amber-600 dark:text-amber-400";
              } else if (node.status === "in-progress") {
                statusBorder = "border-primary/40";
                statusBg = "bg-primary/5";
                statusText = "text-primary";
              } else if (node.status === "locked") {
                statusBorder = "border-border/60";
                statusBg = "bg-muted/40 opacity-70";
                statusText = "text-muted-foreground";
              }

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between gap-2.5 ${statusBorder} ${statusBg} ${
                    isSelected ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                      {node.subject}
                    </span>
                    {node.status === "mastered" ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : node.status === "needs-review" ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : node.status === "locked" ? (
                      <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <Brain className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-foreground leading-snug">
                      {node.label}
                    </h4>
                    <span className={`text-[11px] font-mono font-semibold ${statusText}`}>
                      {node.masteryLevel}% mastery
                    </span>
                  </div>

                  <Progress value={node.masteryLevel} className="h-1.5" />
                </div>
              );
            })}
          </div>

          {/* Prerequisite connectivity indicator footer */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>Dependency arrows indicate direct conceptual prerequisites.</span>
            <span className="font-mono">{filteredNodes.length} nodes loaded</span>
          </div>
        </div>

        {/* Selected Node Details Drawer (1 col) */}
        <div>
          {activeNode ? (
            <Card className="border-border shadow-sm sticky top-24">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize text-[10px]">
                    {activeNode.difficulty}
                  </Badge>
                  <span className="text-xs font-semibold text-primary">
                    {activeNode.subject}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold">{activeNode.label}</CardTitle>
                <CardDescription className="text-xs">
                  {activeNode.summary}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-2">
                {/* Mastery Level */}
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Current Verified Mastery</span>
                    <span className="font-mono text-primary font-bold">{activeNode.masteryLevel}%</span>
                  </div>
                  <Progress value={activeNode.masteryLevel} />
                </div>

                {/* Prerequisites info */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground">Prerequisites:</span>
                  {activeNode.prerequisites.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {activeNode.prerequisites.map((pId) => {
                        const target = mapData.nodes.find((n) => n.id === pId);
                        return (
                          <span
                            key={pId}
                            className="px-2 py-0.5 rounded bg-muted text-[11px] text-muted-foreground font-mono"
                          >
                            {target?.label || pId}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-[11px]">
                      No prerequisites required. Foundational concept.
                    </p>
                  )}
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <Link href={`/teach?topic=top-attention-mech`} className="block">
                    <Button size="sm" className="w-full text-xs gap-1.5 shadow-sm font-semibold">
                      <span>Teach in Teach Mode Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/quiz?topic=top-attention-mech`} className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                      <span>Take Adaptive Quiz</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-8 text-center text-muted-foreground text-xs">
              Select any concept in the graph to inspect prerequisites and launch Teach Mode.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
