"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Mic2,
  Sparkles,
  HelpCircle,
  Network,
  BookOpen,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  Award,
  User,
  Settings,
  Flame,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Learning Engine",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Learn", href: "/learn", icon: Compass },
      { name: "Teach Mode", href: "/teach", icon: Mic2, highlight: true },
      { name: "AI Feedback", href: "/teach/feedback", icon: Sparkles },
      { name: "Adaptive Quiz", href: "/quiz", icon: HelpCircle },
      { name: "Knowledge Map", href: "/knowledge-map", icon: Network },
    ],
  },
  {
    title: "Retention & Mastery",
    items: [
      { name: "Active Notes", href: "/notes", icon: BookOpen },
      { name: "Revision Queue", href: "/revision", icon: RotateCcw, badge: "4 due" },
      { name: "Study Plan", href: "/study-plan", icon: CalendarCheck },
    ],
  },
  {
    title: "Progress & Identity",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Achievements", href: "/achievements", icon: Award },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/60 backdrop-blur-md h-screen sticky top-0 z-30 transition-all">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-tight shadow-md shadow-primary/20">
            D
          </div>
          <div>
            <div className="font-bold text-base tracking-tight leading-none text-foreground">
              DUALMIND
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
              Active EdTech
            </div>
          </div>
        </Link>
        <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
          Sys 1
        </span>
      </div>

      {/* Streak & Mastery Mini Metric */}
      <div className="p-4 mx-3 my-3 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground">14 Day Streak</div>
            <div className="text-[10px] text-muted-foreground">Active learner</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-primary font-mono">74%</div>
          <div className="text-[10px] text-muted-foreground">Mastery</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                      : item.highlight
                      ? "text-primary hover:bg-primary/10 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-primary-foreground"
                          : item.highlight
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && !isActive && (
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0 h-4">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-border mt-auto">
        <Link
          href="/profile"
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="flex items-center gap-2.5">
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              fallback="AV"
              className="w-8 h-8"
            />
            <div className="text-left">
              <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                Alex Vance
              </div>
              <div className="text-[10px] text-muted-foreground">alex@example.com</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}
