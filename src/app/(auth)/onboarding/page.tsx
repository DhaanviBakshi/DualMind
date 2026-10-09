"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  Glasses,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const totalSteps = 4;

  // Selections
  const [discipline, setDiscipline] = React.useState("Machine Learning & AI");
  const [level, setLevel] = React.useState("intermediate");
  const [aiStyle, setAiStyle] = React.useState("socratic");
  const [dailyGoal, setDailyGoal] = React.useState(30);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding and navigate to dashboard
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <Card className="border-border shadow-xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(progressPercent)}% completed</span>
        </div>
        <Progress value={progressPercent} />
        <CardTitle className="text-2xl font-bold pt-2">
          {step === 1 && "What is your primary study domain?"}
          {step === 2 && "What is your current mastery level?"}
          {step === 3 && "Choose your AI sparring partner persona"}
          {step === 4 && "Set your daily active-recall commitment"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "DUALMIND tailors its knowledge graph to your active field."}
          {step === 2 && "This sets the baseline difficulty for Socratic follow-up questions."}
          {step === 3 && "How would you like the AI to challenge your explanations?"}
          {step === 4 && "Small, daily active recall sessions beat cramming by 4x."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        {/* Step 1: Discipline */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "Machine Learning & AI", desc: "Transformers, gradient descent, optimization" },
              { id: "Distributed Systems", desc: "Consensus, CAP, replication, Raft" },
              { id: "Quantum Computing", desc: "Superposition, entanglement, quantum gates" },
              { id: "Neuroscience", desc: "Synaptic plasticity, action potentials, LTP" },
              { id: "Algorithms & Systems", desc: "Heaps, graphs, dynamic programming" },
              { id: "Custom Discipline", desc: "Upload syllabus or define custom curriculum" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDiscipline(item.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  discipline === item.id
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                    : "border-border hover:border-border/80 hover:bg-muted/50 text-foreground"
                }`}
              >
                <div className="font-semibold text-sm">{item.id}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Mastery Level */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              { id: "beginner", title: "Beginner", desc: "New to the core models; focus on foundational analogies and simple vocabulary." },
              { id: "intermediate", title: "Intermediate", desc: "Solid conceptual grasp; ready for technical edge cases and counter-arguments." },
              { id: "advanced", title: "Advanced", desc: "Experienced practitioner; AI will probe rigorous proofs and mathematical nuances." },
              { id: "expert", title: "Expert", desc: "Research-grade interrogation; AI challenges assumptions and rare failure modes." },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLevel(item.id)}
                className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                  level === item.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                </div>
                {level === item.id && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-3" />}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: AI Sparring Persona */}
        {step === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: "socratic",
                title: "The Socratic Interrogator",
                desc: "Never gives the answer directly; guides you through probing questions.",
              },
              {
                id: "curious",
                title: "The Curious 10-Year-Old",
                desc: "Forces you to eliminate all jargon and explain with vivid real-world analogies.",
              },
              {
                id: "rigorous",
                title: "The Rigorous Professor",
                desc: "Demands formal accuracy, mathematical precision, and edge-case clarity.",
              },
              {
                id: "supportive",
                title: "The Supportive Coach",
                desc: "Focuses on encouraging momentum while gently repairing misconceptions.",
              },
            ].map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setAiStyle(persona.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  aiStyle === persona.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="font-semibold text-sm text-foreground">{persona.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{persona.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Step 4: Daily Goal */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[15, 25, 40, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoal(mins)}
                  className={`p-4 rounded-xl text-center border transition-all ${
                    dailyGoal === mins
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="text-2xl font-bold font-mono text-foreground">{mins}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">min / day</div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-muted/60 border border-border/80 text-xs text-muted-foreground flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <span>
                Based on cognitive science, a daily <strong>{dailyGoal}-minute session</strong> yields ~85% retention compared to 4 hours of weekend cramming.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="outline" size="sm" onClick={handleBack} className="gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          ) : (
            <div />
          )}

          <Button size="sm" onClick={handleNext} className="gap-1.5 shadow-md">
            <span>{step === totalSteps ? "Enter DualMind Dashboard" : "Continue"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
