"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  RotateCcw,
  Quote,
  Layers,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

function FeedbackContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session") || "sess-101";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="indigo">System 2 Cognitive Audit</Badge>
            <span className="text-xs font-mono text-muted-foreground">{sessionId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-1">
            AI Teacher Comprehensive Rubric
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Self-Attention Mechanism • Evaluated by Socratic Interrogator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/teach?topic=top-attention-mech">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Teach Session</span>
            </Button>
          </Link>
          <Link href="/notes">
            <Button size="sm" className="gap-1.5 text-xs shadow-md">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Export as Active Note</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Score Overview Card */}
      <Card className="border-border shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="text-center md:border-r md:border-border pr-0 md:pr-6 space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Overall Feynman Score
              </div>
              <div className="text-4xl font-black font-mono text-primary">84%</div>
              <Badge variant="success" className="text-[10px]">Verified Solid</Badge>
            </div>

            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>Rubric Synthesis</span>
                <span className="text-muted-foreground">Passing benchmark: 70%</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your explanation demonstrated strong conceptual intuition for vector projections and token similarity. To elevate to expert level, clarify the derivative behavior during softmax saturation and explicitly describe positional encoding mechanisms.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4 Rubric Dimensions with in-depth evaluation criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Accuracy */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. Scientific Accuracy
              </CardTitle>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">86%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <Progress value={86} />
            <p className="text-muted-foreground pt-1">
              Correctly mapped Query, Key, and Value matrix multiplications and the softmax coefficient normalization.
            </p>
          </CardContent>
        </Card>

        {/* Completeness */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                2. Curriculum Completeness
              </CardTitle>
              <span className="font-mono font-bold text-sm text-indigo-600 dark:text-indigo-400">74%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <Progress value={74} />
            <p className="text-muted-foreground pt-1">
              Omitted the scaling division factor (1/sqrt(d_k)) and its mathematical impact on vanishing gradients during training.
            </p>
          </CardContent>
        </Card>

        {/* Clarity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                3. Plain-Language Clarity
              </CardTitle>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">90%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <Progress value={90} />
            <p className="text-muted-foreground pt-1">
              Exceptional use of the library catalog analogy. High readability with zero circular reasoning or hand-waving.
            </p>
          </CardContent>
        </Card>

        {/* Understanding */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-500" />
                4. Cognitive Depth & Transfer
              </CardTitle>
              <span className="font-mono font-bold text-sm text-amber-600 dark:text-amber-400">82%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <Progress value={82} />
            <p className="text-muted-foreground pt-1">
              Answered the Socratic follow-up question regarding permutation-invariance with good intuition for sequence tokens.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Explanation Quote & Annotated Citations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Quote className="w-4 h-4 text-primary" />
            Annotated Transcript
          </CardTitle>
          <CardDescription className="text-xs">
            Reviewing your spoken explanation against target key concepts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-xl bg-muted/60 border border-border text-xs leading-relaxed italic text-foreground">
            &ldquo;In transformers, self-attention lets each word look at all other words in a sentence. It uses Query, Key, and Value vectors. We take the dot product of Query and Key, divide by the square root of dimension to keep numbers manageable, apply softmax to get weights, and multiply by Values.&rdquo;
          </div>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ✓ Q, K, V Projections accurately identified
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              ⚠ Vague rationale: &quot;keep numbers manageable&quot; vs &quot;prevent softmax gradient saturation&quot;
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AITeacherFeedbackPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground animate-pulse">
          Loading AI Teacher Feedback...
        </div>
      }
    >
      <FeedbackContent />
    </React.Suspense>
  );
}
