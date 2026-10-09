"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Flame,
  HelpCircle,
  Sparkles,
  Command,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";

export function Header() {
  const pathname = usePathname();
  const [isDark, setIsDark] = React.useState(false);
  const [showSearchModal, setShowSearchModal] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        setIsDark(false);
        localStorage.setItem("theme", "light");
      } else {
        root.classList.add("dark");
        setIsDark(true);
        localStorage.setItem("theme", "dark");
      }
    }
  };

  // Generate dynamic breadcrumb from pathname
  const segments = pathname.split("/").filter(Boolean);
  const currentTitle = segments.length > 0
    ? segments[segments.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Dashboard";

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
      {/* Breadcrumb & Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            DUALMIND
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">{currentTitle}</span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar */}
        <button
          onClick={() => setShowSearchModal(true)}
          className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 hover:bg-muted border border-border/60 px-3 py-1.5 rounded-lg transition-colors w-48 lg:w-64"
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="flex-1 text-left">Search topics or notes...</span>
          <kbd className="hidden lg:inline-flex text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Quick Teach CTA */}
        <Link href="/teach">
          <Button size="sm" className="hidden md:flex items-center gap-1.5 shadow-sm shadow-primary/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Teach Mode</span>
          </Button>
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
        </button>

        {/* User Avatar */}
        <Link href="/profile">
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            fallback="AV"
            className="w-8 h-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
          />
        </Link>
      </div>

      {/* Quick Search Dialog */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                autoFocus
                placeholder="Search concepts, topics, or misconceptions..."
                className="w-full bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="text-muted-foreground px-2 font-medium">Quick Suggestions</div>
              <Link
                href="/teach?topic=top-attention-mech"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
              >
                <span>Self-Attention Mechanism</span>
                <span className="text-[10px] text-primary">Teach Mode</span>
              </Link>
              <Link
                href="/knowledge-map"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
              >
                <span>Raft Consensus Algorithm</span>
                <span className="text-[10px] text-amber-500">Review Gap</span>
              </Link>
              <Link
                href="/revision"
                onClick={() => setShowSearchModal(false)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted text-foreground transition-colors"
              >
                <span>Today&apos;s 4 Spaced Repetition Flashcards</span>
                <span className="text-[10px] text-emerald-500">Revision</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
