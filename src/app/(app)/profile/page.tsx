"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Flame,
  Brain,
  Clock,
  CheckCircle2,
  Award,
  Sparkles,
  Settings,
  Share2,
  Download,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Progress } from "@/components/ui/Progress";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header Card */}
      <Card className="border-border shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/30 via-indigo-600/20 to-primary/10 border-b border-border" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <Avatar
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                fallback="AV"
                className="w-24 h-24 ring-4 ring-card shadow-lg"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">Alex Vance</h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  alex.vance@example.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/settings">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </Button>
              </Link>
              <Button size="sm" className="gap-1.5 text-xs shadow-sm">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Profile</span>
              </Button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-foreground max-w-2xl leading-relaxed mt-2">
            Graduate researcher focusing on deep learning architectures, attention mechanisms, and fault-tolerant distributed consensus algorithms. Dedicated to active recall and Socratic peer instruction.
          </p>
        </CardContent>
      </Card>

      {/* Vital Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Active Streak</span>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500" />
            <span>14 Days</span>
          </div>
        </Card>

        <Card className="text-center p-4">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Verified Mastery</span>
          <div className="text-2xl font-bold font-mono text-primary mt-1">74%</div>
        </Card>

        <Card className="text-center p-4">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Concepts Taught</span>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">28</div>
        </Card>

        <Card className="text-center p-4">
          <span className="text-[11px] text-muted-foreground uppercase font-semibold">Cognitive Time</span>
          <div className="text-2xl font-bold font-mono text-indigo-500 mt-1">30.6h</div>
        </Card>
      </div>

      {/* Verified Certificate of Feynman Mastery */}
      <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge variant="indigo" className="text-[10px]">Academic Credential</Badge>
            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </Button>
          </div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Certificate of Socratic Mastery — Machine Learning & AI
          </CardTitle>
          <CardDescription className="text-xs">
            Issued by DUALMIND Engine • Verified across 4 cognitive dimensions with 0% unearned jargon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-semibold text-foreground">Verified Competencies:</div>
              <div className="text-muted-foreground">
                Self-Attention, Backpropagation, Layer Normalization, Matrix Projection, Softmax Gradients.
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              ID: DM-2026-CERT-9041
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
