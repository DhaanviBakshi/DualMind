"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Compass,
  Mic2,
  RotateCcw,
  Menu,
  X,
  Network,
  BookOpen,
  CalendarCheck,
  BarChart3,
  Award,
  Settings,
  User,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Learn", href: "/learn", icon: Compass },
    { name: "Teach", href: "/teach", icon: Mic2, center: true },
    { name: "Revision", href: "/revision", icon: RotateCcw },
  ];

  const drawerLinks = [
    { name: "AI Feedback", href: "/teach/feedback", icon: Mic2 },
    { name: "Adaptive Quiz", href: "/quiz", icon: Compass },
    { name: "Knowledge Map", href: "/knowledge-map", icon: Network },
    { name: "Active Notes", href: "/notes", icon: BookOpen },
    { name: "Study Plan", href: "/study-plan", icon: CalendarCheck },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Achievements", href: "/achievements", icon: Award },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Bottom Sticky Bar for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/90 backdrop-blur-lg border-t border-border px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-6 group"
              >
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-95 group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-primary mt-1">Teach</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* More Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors",
            drawerOpen && "text-primary"
          )}
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Slide-over Drawer for remaining pages */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative z-50 bg-card border-t border-border rounded-t-2xl p-6 shadow-2xl space-y-4 max-h-[75vh] overflow-y-auto pb-20 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-semibold text-foreground text-sm">DUALMIND Navigation</div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {drawerLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-medium border border-border/60 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/40 hover:bg-muted text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
