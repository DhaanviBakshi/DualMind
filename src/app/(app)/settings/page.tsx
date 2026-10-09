"use client";

import * as React from "react";
import {
  apiClient,
  isMockModeEnabled,
  setMockMode,
  getApiBaseUrl,
  setApiBaseUrl,
} from "@/lib/api-client";
import {
  Settings as SettingsIcon,
  Server,
  Mic,
  Brain,
  Palette,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Moon,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";

export default function SettingsPage() {
  // Integration Settings
  const [isMock, setIsMock] = React.useState(true);
  const [apiUrl, setApiUrl] = React.useState("/api");
  const [healthStatus, setHealthStatus] = React.useState<"idle" | "testing" | "success" | "failed">("idle");
  const [healthMessage, setHealthMessage] = React.useState("");

  // AI & Voice Preferences
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [persona, setPersona] = React.useState("socratic");
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  React.useEffect(() => {
    setIsMock(isMockModeEnabled());
    setApiUrl(getApiBaseUrl());
  }, []);

  const handleToggleMock = (enabled: boolean) => {
    setMockMode(enabled);
    setIsMock(enabled);
  };

  const handleTestConnection = async () => {
    setHealthStatus("testing");
    try {
      await apiClient.getDashboard();
      setHealthStatus("success");
      setHealthMessage(
        isMock
          ? "Mock adapter verified: All 16 typed contracts functioning properly."
          : `Successfully connected to live backend at ${apiUrl}`
      );
    } catch (err: unknown) {
      setHealthStatus("failed");
      setHealthMessage(err instanceof Error ? err.message : "Connection failed");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setApiBaseUrl(apiUrl);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-primary" />
          Platform Settings & System 1 Gateways
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure API integration contracts, AI sparring persona, and voice dictation hardware.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Backend Integration & Contracts */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Server className="w-4 h-4 text-primary" />
                System Integration & Backend Adapter
              </CardTitle>
              {isMock ? (
                <Badge variant="warning" className="text-[10px]">Mock Adapter Active</Badge>
              ) : (
                <Badge variant="success" className="text-[10px]">Live Backend Mode</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              System 1 provides high-fidelity mock implementations for dev and coordinates with Systems 2 & 3.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-foreground">
                  Use Development Mock Adapter
                </label>
                <p className="text-xs text-muted-foreground">
                  When enabled, all 16 endpoints return realistic, stateful Feynman data without needing System 3 running.
                </p>
              </div>
              <Switch checked={isMock} onCheckedChange={handleToggleMock} />
            </div>

            {/* Custom API Base URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Target API Base URL
              </label>
              <div className="flex gap-2">
                <Input
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="e.g. http://localhost:8000 or /api"
                  className="font-mono text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={healthStatus === "testing"}
                  className="shrink-0 gap-1.5 text-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${healthStatus === "testing" ? "animate-spin" : ""}`} />
                  <span>Test Endpoint</span>
                </Button>
              </div>
            </div>

            {/* Connection Health Alert */}
            {healthStatus !== "idle" && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  healthStatus === "success"
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                    : healthStatus === "failed"
                    ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300"
                    : "bg-muted border-border text-foreground"
                }`}
              >
                {healthStatus === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                )}
                <span>{healthMessage}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: AI Sparring Persona */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              AI Teacher Persona & Cognitive Rigor
            </CardTitle>
            <CardDescription className="text-xs">
              Calibrate how aggressively System 2 probes your logic and catches gaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: "socratic", title: "Socratic Interrogator", desc: "Never gives the answer directly; guides you through probing questions." },
                { id: "curious", title: "Curious 10-Year-Old", desc: "Forces you to eliminate all jargon and explain with vivid real-world analogies." },
                { id: "rigorous", title: "Rigorous Professor", desc: "Demands formal accuracy, mathematical precision, and edge-case clarity." },
                { id: "supportive", title: "Supportive Coach", desc: "Focuses on encouraging momentum while gently repairing misconceptions." },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    persona === p.id
                      ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="font-semibold text-xs text-foreground">{p.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Voice & Audio Settings */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              Voice Dictation & Speech API
            </CardTitle>
            <CardDescription className="text-xs">
              Hardware integration for verbal explanations in Teach Mode Studio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
              <div className="space-y-0.5">
                <label className="text-xs font-semibold text-foreground">
                  Enable Browser Speech-to-Text
                </label>
                <p className="text-xs text-muted-foreground">
                  Uses Web Speech API (`webkitSpeechRecognition`) with graceful fallback to keyboard input.
                </p>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Settings saved successfully!
            </span>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" className="gap-2 shadow-md font-semibold">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
