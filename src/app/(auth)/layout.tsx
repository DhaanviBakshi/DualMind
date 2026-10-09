import * as React from "react";
import Link from "next/link";
import { Sparkles, Brain, Quote } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left side: Feynman quote and EdTech branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden border-r border-slate-800">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold tracking-tight shadow-md shadow-primary/30">
              D
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">DUALMIND</span>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                System 1 Interface
              </div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <Quote className="w-10 h-10 text-primary/40" />
          <blockquote className="text-2xl font-serif leading-relaxed text-slate-100">
            &ldquo;If you want to master something, teach it. The more you teach, the better you learn. Teaching is a powerful tool to learning.&rdquo;
          </blockquote>
          <div className="text-sm">
            <div className="font-semibold text-white">Richard P. Feynman</div>
            <div className="text-slate-400">Nobel Laureate in Physics & Pioneer of Active Explanation</div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-6">
          <span>AI Sparring Engine Ready</span>
          <span>4-Dimensional Rubric</span>
        </div>
      </div>

      {/* Right side: Auth Form container */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
