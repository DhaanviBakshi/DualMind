import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Public Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-tight shadow-md shadow-primary/20">
              D
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                DUALMIND
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-medium text-muted-foreground">
                Teach to Learn. Learn to Teach.
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#learning-loop" className="hover:text-foreground transition-colors">
              The Feynman Loop
            </a>
            <a href="#comparison" className="hover:text-foreground transition-colors">
              DualMind vs Generic AI
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="shadow-sm shadow-primary/25">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Marketing Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 text-muted-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                D
              </div>
              <span className="font-bold text-foreground">DUALMIND</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Teach to Learn. Learn to Teach. The active-learning EdTech platform where you prove deep understanding to an AI student and sparring partner.
            </p>
            <div className="text-[11px] text-muted-foreground/80">
              © {new Date().getFullYear()} DUALMIND Inc. System 1 Architecture.
            </div>
          </div>

          <div>
            <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Core Method
            </div>
            <ul className="space-y-2 text-xs">
              <li><a href="#how-it-works" className="hover:text-foreground">Feynman Active Recall</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground">Socratic Interrogation</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground">Misconception Detection</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground">Spaced Retrieval</a></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Platform
            </div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/dashboard" className="hover:text-foreground">App Dashboard</Link></li>
              <li><Link href="/teach" className="hover:text-foreground">Teach Mode Studio</Link></li>
              <li><Link href="/knowledge-map" className="hover:text-foreground">Knowledge Graph</Link></li>
              <li><Link href="/quiz" className="hover:text-foreground">Adaptive Quizzes</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-semibold text-foreground text-xs uppercase tracking-wider mb-3">
              Architecture & API
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-2">
              System 1 (Frontend & UI) communicates via typed integration contracts with System 2 (AI Engine) and System 3 (Backend).
            </p>
            <Link href="/settings" className="text-xs text-primary font-medium hover:underline">
              Inspect API & Mock Adapter →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
