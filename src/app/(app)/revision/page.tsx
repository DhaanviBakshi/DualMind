"use client";

import * as React from "react";
import Link from "next/link";
import { RevisionCard } from "@/types/dualmind";
import {
  RotateCcw,
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  HelpCircle,
  Eye,
  Award,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const INITIAL_QUEUE: RevisionCard[] = [
  {
    id: "rev-1",
    topicId: "top-attention-mech",
    topicTitle: "Self-Attention Mechanism",
    prompt: "Why is the dot-product scaled by 1/sqrt(d_k) before applying softmax?",
    answer: "For large dimensions of d_k, dot products grow large in magnitude, which pushes the softmax function into regions with tiny gradients (gradient vanishing). Dividing by sqrt(d_k) scales the variance back to 1.",
    analogyTip: "Volume normalization before an amplifier to avoid saturation distortion.",
    intervalDays: 4,
    repetitionCount: 3,
    easeFactor: 2.5,
    dueDate: "Today",
  },
  {
    id: "rev-2",
    topicId: "top-neuro-synaptic",
    topicTitle: "Long-Term Potentiation (LTP)",
    prompt: "What physiological role does the Mg2+ plug play in the NMDA receptor channel?",
    answer: "It acts as a molecular coincidence detector. At resting potential, magnesium blocks the pore. Only when the postsynaptic cell is depolarized does electrostatic repulsion remove the plug, permitting Ca2+ influx.",
    analogyTip: "A physical lock that requires both a key (glutamate) and a battery voltage (depolarization).",
    intervalDays: 2,
    repetitionCount: 1,
    easeFactor: 2.1,
    dueDate: "Today",
  },
  {
    id: "rev-3",
    topicId: "top-consensus-raft",
    topicTitle: "Raft Consensus Algorithm",
    prompt: "Under what condition can a Raft candidate receive a vote from a peer during leader election?",
    answer: "A voter grants its vote only if the candidate's log is at least as up-to-date as its own log (higher term, or same term with longer index).",
    analogyTip: "You can only elect a secretary who has kept the minutes at least as thoroughly as yourself.",
    intervalDays: 3,
    repetitionCount: 2,
    easeFactor: 2.3,
    dueDate: "Today",
  },
  {
    id: "rev-4",
    topicId: "top-quantum-superposition",
    topicTitle: "Quantum Superposition & Qubits",
    prompt: "What state transformation does a Hadamard gate perform on a standard |0⟩ qubit?",
    answer: "It maps |0⟩ to (|0⟩ + |1⟩)/sqrt(2), placing the qubit into an equal superposition state on the equator of the Bloch sphere.",
    analogyTip: "Flipping a fair coin into mid-air spin before it lands on heads or tails.",
    intervalDays: 5,
    repetitionCount: 4,
    easeFactor: 2.6,
    dueDate: "Today",
  },
];

export default function RevisionPage() {
  const [queue, setQueue] = React.useState<RevisionCard[]>(INITIAL_QUEUE);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  const currentCard = queue[currentIndex];

  const handleRating = (rating: "again" | "hard" | "good" | "easy") => {
    setIsFlipped(false);
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <RotateCcw className="w-7 h-7 text-primary" />
            Spaced Repetition Revision
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            SM-2 Leitner algorithm queue. Refresh neural pathways before memory decay curves trigger.
          </p>
        </div>

        {!completed && (
          <Badge variant="indigo" className="text-xs px-3 py-1 font-mono">
            Card {currentIndex + 1} of {queue.length}
          </Badge>
        )}
      </div>

      {/* Main Flashcard or Completion Screen */}
      {!completed && currentCard ? (
        <div className="space-y-6">
          {/* Card Presentation */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[320px] rounded-2xl border border-border bg-card shadow-lg p-8 cursor-pointer transition-all hover:border-primary/50 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-primary">
                  {currentCard.topicTitle}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isFlipped ? "Showing Answer" : "Click to Flip"}</span>
                </span>
              </div>

              {!isFlipped ? (
                /* Front Prompt */
                <div className="space-y-3 pt-6">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Target Retrieval Question
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed">
                    {currentCard.prompt}
                  </h3>
                </div>
              ) : (
                /* Back Answer & Analogy */
                <div className="space-y-6 pt-2 animate-in fade-in">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Verified Formulation
                    </span>
                    <p className="text-base text-foreground leading-relaxed font-medium">
                      {currentCard.answer}
                    </p>
                  </div>

                  {currentCard.analogyTip && (
                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
                      <span className="font-bold text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Feynman Analogy Anchor:
                      </span>
                      <p className="text-muted-foreground">{currentCard.analogyTip}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Next interval: {currentCard.intervalDays} days</span>
              <span>Ease: {currentCard.easeFactor}x</span>
            </div>
          </div>

          {/* SM-2 Rating Buttons (visible when flipped) */}
          {isFlipped ? (
            <div className="space-y-3 pt-2 animate-in fade-in">
              <span className="text-xs font-semibold text-muted-foreground block text-center uppercase tracking-wider">
                How smoothly did you recall this concept?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleRating("again")}
                  className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 text-rose-800 dark:text-rose-200 text-xs font-semibold text-center transition-all"
                >
                  <div>Again</div>
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-0.5">&lt; 10 mins</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating("hard")}
                  className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/50 text-amber-800 dark:text-amber-200 text-xs font-semibold text-center transition-all"
                >
                  <div>Hard</div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">2 days</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating("good")}
                  className="p-3.5 rounded-xl border border-indigo-300 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-100/50 text-indigo-800 dark:text-indigo-200 text-xs font-semibold text-center transition-all"
                >
                  <div>Good</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">4 days</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRating("easy")}
                  className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center transition-all"
                >
                  <div>Easy</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">7 days</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFlipped(true)}
                className="gap-2 text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Show Verified Answer</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Completion Screen */
        <Card className="text-center p-12 space-y-6 shadow-xl border-border">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Today&apos;s Revision Queue Cleared!
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              All 4 active retrieval cards have been reviewed. Synaptic intervals successfully updated in the spaced repetition engine.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              <span>Review Again</span>
            </Button>
            <Link href="/dashboard">
              <Button size="sm" className="gap-2 shadow-md">
                <span>Back to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
