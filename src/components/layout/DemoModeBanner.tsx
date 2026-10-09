"use client";

import * as React from "react";
import { isMockModeEnabled, setMockMode, getApiBaseUrl } from "@/lib/api-client";
import { AlertCircle, CheckCircle2, Server, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DemoModeBanner() {
  const [isMock, setIsMock] = React.useState(true);
  const [baseUrl, setBaseUrl] = React.useState("/api");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    setIsMock(isMockModeEnabled());
    setBaseUrl(getApiBaseUrl());

    const handleUpdate = () => {
      setIsMock(isMockModeEnabled());
      setBaseUrl(getApiBaseUrl());
    };

    window.addEventListener("dualmind_mock_mode_changed", handleUpdate);
    window.addEventListener("dualmind_api_url_changed", handleUpdate);
    return () => {
      window.removeEventListener("dualmind_mock_mode_changed", handleUpdate);
      window.removeEventListener("dualmind_api_url_changed", handleUpdate);
    };
  }, []);

  const toggleMode = (mode: boolean) => {
    setMockMode(mode);
    setIsMock(mode);
  };

  return (
    <div className="w-full bg-slate-900 text-white text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
      <div className="flex items-center gap-2">
        {isMock ? (
          <span className="flex items-center gap-1.5 font-medium text-amber-400">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Development Demo Mode Active</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Live Backend Connected</span>
          </span>
        )}
        <span className="hidden sm:inline text-slate-400">|</span>
        <span className="hidden sm:inline text-slate-400">
          Target: <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-200">{baseUrl}</code>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-[11px] hidden md:inline">
          {isMock
            ? "Using System 1 High-Fidelity Mock Adapter (Systems 2 & 3 ready)"
            : "Directly dispatching to real System 2/3 endpoints"}
        </span>
        <button
          onClick={() => toggleMode(!isMock)}
          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
            isMock
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
          }`}
        >
          {isMock ? "Switch to Live API" : "Switch to Demo Mock"}
        </button>
      </div>
    </div>
  );
}
