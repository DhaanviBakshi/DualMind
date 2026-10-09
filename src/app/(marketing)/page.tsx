"use client";

import * as React from "react";
import Link from "next/link";
import {
  Mic,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Layers,
  ShieldAlert,
  GraduationCap,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      q: "How does DUALMIND differ from simply asking ChatGPT to explain something?",
      a: "Generic AI tools encourage passive consumption: you read an explanation, feel the illusion of competence, and forget it 48 hours later. DUALMIND reverses the direction: YOU must explain the concept to an AI student. The AI evaluates your explanation, discovers your hidden misconceptions, probes your logic with Socratic questions, and forces active cognitive retrieval."
    },
    {
      q: "What is the Feynman Technique and how is it implemented?",
      a: "Physicist Richard Feynman proved that if you cannot explain a concept in simple terms without jargon, you do not truly understand it. DUALMIND measures four cognitive dimensions: Accuracy, Completeness, Clarity, and Genuine Understanding, penalizing rote memorization and rewarding intuitive analogies."
    },
    {
      q: "Can I explain concepts verbally using my microphone?",
      a: "Yes! DUALMIND integrates browser speech-to-text with the Web Speech API, allowing you to pace around your room and teach verbally just like in a lecture hall, with immediate graceful fallback to text."
    },
    {
      q: "How do adaptive quizzes and knowledge maps fit in?",
      a: "After you teach and repair identified knowledge gaps, DUALMIND generates adaptive micro-quizzes specifically targeting the edge cases you missed. Your mastery graph updates dynamically, scheduling spaced repetition reviews before memories decay."
    }
  ];

  return (
    <div className="flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <Badge variant="indigo" className="px-3.5 py-1 text-xs font-semibold gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Active Learning Engine
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Teach to Learn. <br />
            <span className="text-primary bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Learn to Teach.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground font-normal max-w-2xl mx-auto leading-relaxed">
            &ldquo;Don&apos;t just ask AI for answers. Prove that you understand them.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto">
            Break free from the passive reading trap. Explain concepts to an AI student that probes your gaps, detects subtle misconceptions, and elevates you to true mastery.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/teach">
              <Button size="lg" className="h-13 px-8 text-base shadow-lg shadow-primary/25 gap-2 group">
                <span>Start Learning</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="h-13 px-7 text-base">
                See How It Works
              </Button>
            </a>
          </div>

          {/* Social Proof metric bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-border/60 text-left">
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">3.8x</div>
              <div className="text-xs text-muted-foreground">Long-term retention vs passive reading</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">4D</div>
              <div className="text-xs text-muted-foreground">Cognitive rubric evaluation</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">100%</div>
              <div className="text-xs text-muted-foreground">Socratic active recall</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">0%</div>
              <div className="text-xs text-muted-foreground">Passive copy-paste illusion</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM: The Passive AI Trap */}
      <section className="w-full py-20 bg-muted/40 border-y border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge variant="destructive" className="mb-3">
              The Modern Learning Crisis
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              AI made getting answers effortless. <br />
              It made genuine understanding rarer than ever.
            </h2>
            <p className="text-muted-foreground mt-4 text-base">
              When an LLM summarizes a complex topic for you, your brain recognizes the logic and mistakes recognition for mastery. This is called the <strong>Illusion of Competence</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/80">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-2 font-bold">
                  ✕
                </div>
                <CardTitle className="text-base">Passive Consumption</CardTitle>
                <CardDescription>
                  Reading polished AI answers without synthesizing creates zero durable synaptic pathways.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/80">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mb-2 font-bold">
                  !
                </div>
                <CardTitle className="text-base">Invisible Misconceptions</CardTitle>
                <CardDescription>
                  Generic chatbots never check if you understood. They nod along, validating false assumptions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/80">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mb-2 font-bold">
                  ⚡
                </div>
                <CardTitle className="text-base">The DUALMIND Solution</CardTitle>
                <CardDescription>
                  Flip the classroom. You become the instructor. You teach, the AI interrogates, and you prove mastery.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. THE FEYNMAN LEARNING LOOP */}
      <section id="learning-loop" className="w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="indigo" className="mb-3">
              The Cognitive Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              The 4-Step Feynman Active Loop
            </h2>
            <p className="text-muted-foreground mt-3">
              A scientifically validated feedback cycle that exposes gaps and cements long-term memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: "01",
                title: "Select & Anchor",
                desc: "Choose a target concept from your curriculum and rate your initial confidence (0–100%).",
                icon: Layers,
              },
              {
                step: "02",
                title: "Teach to AI",
                desc: "Explain the concept out loud using voice dictation or text. Use plain language and analogies.",
                icon: Mic,
              },
              {
                step: "03",
                title: "Cognitive Rubric",
                desc: "System 2 evaluates Accuracy, Completeness, Clarity, and Understanding, highlighting misconceptions.",
                icon: ShieldAlert,
              },
              {
                step: "04",
                title: "Repair & Retest",
                desc: "Answer Socratic counter-questions, repair the discovered gaps, and take a personalized quiz.",
                icon: CheckCircle2,
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="text-3xl font-black font-mono text-primary/20 mb-4">
                    {s.step}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE TEACH DEMO PREVIEW */}
      <section id="how-it-works" className="w-full py-20 bg-surface-subtle border-y border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="indigo" className="mb-2">Live Session Preview</Badge>
            <h2 className="text-3xl font-bold text-foreground">See How Teach Mode Works</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Watch how DUALMIND evaluates student explanations in real-time.
            </p>
          </div>

          <Card className="shadow-xl border-border overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-300 font-mono ml-2">Topic: Self-Attention Mechanism (Intermediate)</span>
              </div>
              <Badge variant="indigo" className="text-[11px]">Evaluation Score: 84 / 100</Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Student Explanation Simulation */}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-primary" />
                  Your Spoken Explanation
                </div>
                <div className="p-4 rounded-lg bg-muted/60 text-sm text-foreground leading-relaxed italic border border-border/60">
                  &ldquo;In transformers, self-attention lets each word look at all other words in a sentence. It uses Query, Key, and Value vectors. We take the dot product of Query and Key, divide by the square root of dimension to keep numbers manageable, apply softmax to get weights, and multiply by Values.&rdquo;
                </div>
              </div>

              {/* Rubric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">86%</div>
                </div>
                <div className="p-3 rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground">Completeness</div>
                  <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">74%</div>
                </div>
                <div className="p-3 rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground">Clarity</div>
                  <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">90%</div>
                </div>
                <div className="p-3 rounded-lg border border-border text-center">
                  <div className="text-xs text-muted-foreground">Understanding</div>
                  <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">82%</div>
                </div>
              </div>

              {/* Socratic Counter-Question */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="w-4 h-4" />
                  AI Teacher Socratic Challenge
                </div>
                <p className="text-sm text-foreground">
                  &ldquo;You mentioned dividing by the square root of dimension to keep numbers manageable. <em>What mathematically happens to the softmax gradients if you omit this division?</em>&rdquo;
                </p>
              </div>

              <div className="text-center pt-2">
                <Link href="/teach">
                  <Button className="shadow-md">
                    Launch Teach Mode Studio Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. COMPARISON MATRIX: DUALMIND vs GENERIC AI */}
      <section id="comparison" className="w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="indigo" className="mb-2">Honest Comparison</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Why Generic AI Fails for Learning
            </h2>
            <p className="text-muted-foreground mt-2">
              The fundamental difference between reading an answer and building a neural pathway.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/70 text-xs font-semibold text-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="py-4 px-6">Dimension</th>
                  <th className="py-4 px-6 text-muted-foreground">Generic AI (ChatGPT, Claude)</th>
                  <th className="py-4 px-6 text-primary font-bold bg-primary/5">DUALMIND Active Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">Cognitive Direction</td>
                  <td className="py-4 px-6 text-muted-foreground">Passive: AI lectures you</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5">
                    Active: You explain, AI critiques
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">Misconception Detection</td>
                  <td className="py-4 px-6 text-muted-foreground">None: validates false premises</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5">
                    Explicit detection & flagging
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">Verification of Understanding</td>
                  <td className="py-4 px-6 text-muted-foreground">Assumes you understand</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5">
                    4-part rubric + adaptive quiz
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">Speech-to-Text Studio</td>
                  <td className="py-4 px-6 text-muted-foreground">Generic voice chat</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5">
                    Live lecture pacing + speech analytics
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-foreground">Retention Mechanism</td>
                  <td className="py-4 px-6 text-muted-foreground">Lost in chat history</td>
                  <td className="py-4 px-6 font-semibold text-foreground bg-primary/5">
                    Automated spaced repetition & graph
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="w-full py-20 bg-muted/30 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <Badge variant="indigo" className="mb-2">Common Questions</Badge>
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-5 cursor-pointer transition-colors"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-medium text-foreground text-base">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border/60">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-12 space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Ready to prove you actually understand?
            </h3>
            <p className="text-muted-foreground text-sm">
              Join thousands of students and engineers transforming passive reading into master-level retention.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8 mt-2 shadow-lg shadow-primary/25">
                Enter DUALMIND Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
