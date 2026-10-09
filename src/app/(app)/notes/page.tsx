"use client";

import * as React from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { StudyNote } from "@/types/dualmind";
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Tag,
  Clock,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";

export default function NotesPage() {
  const [notes, setNotes] = React.useState<StudyNote[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedNote, setSelectedNote] = React.useState<StudyNote | null>(null);

  // New Note Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newTopic, setNewTopic] = React.useState("");
  const [newAnalogy, setNewAnalogy] = React.useState("");
  const [newDefinition, setNewDefinition] = React.useState("");
  const [newPitfall, setNewPitfall] = React.useState("");

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiClient.getNotes();
        setNotes(data);
        if (data.length > 0) setSelectedNote(data[0]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const created = await apiClient.saveNote({
      title: newTitle,
      topicTitle: newTopic || "General Active Recall",
      subjectTitle: "Machine Learning & AI",
      summary: newAnalogy || "Active synthesis synthesized from Feynman session.",
      content: `# ${newTitle}\n\n### Core Definition\n${newDefinition}\n\n### Feynman Analogy\n${newAnalogy}\n\n### Common Pitfall\n${newPitfall}`,
      feynmanBreakdown: {
        simpleAnalogy: newAnalogy || "Everyday intuitive analogy.",
        coreDefinition: newDefinition || "Formal scientific definition.",
        commonPitfall: newPitfall || "Pitfall identified during teaching.",
      },
      tags: ["Active Recall", "Feynman"],
    });

    setNotes([created, ...notes]);
    setSelectedNote(created);
    setIsModalOpen(false);
    setNewTitle("");
    setNewTopic("");
    setNewAnalogy("");
    setNewDefinition("");
    setNewPitfall("");
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-primary" />
            Active Feynman Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Structured conceptual syntheses, analogies, and pitfall warnings generated during teaching.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} size="sm" className="gap-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>New Active Note</span>
        </Button>
      </div>

      {/* Main 2-column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Note List (1 col) */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search notes or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="space-y-2.5">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/40"
                      : "border-border hover:bg-muted/50 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                    <span className="font-semibold text-primary">{note.topicTitle}</span>
                    <span>{note.flashcardCount} cards</span>
                  </div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">
                    {note.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {note.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Reader & Feynman Breakdown (2 cols) */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <Card className="border-border shadow-sm">
              <CardHeader className="border-b border-border pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="indigo" className="text-[10px]">
                    {selectedNote.subjectTitle}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Updated {new Date(selectedNote.updatedAt).toLocaleDateString()}</span>
                  </span>
                </div>
                <CardTitle className="text-2xl font-bold">{selectedNote.title}</CardTitle>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedNote.tags.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* 3-Part Feynman Breakdown Cards */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Feynman 3-Point Decomposition
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-1">
                      <span className="text-[10px] font-bold text-primary uppercase">1. Plain Analogy</span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {selectedNote.feynmanBreakdown.simpleAnalogy}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">2. Core Definition</span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {selectedNote.feynmanBreakdown.coreDefinition}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">3. Common Pitfall</span>
                      <p className="text-xs text-foreground leading-relaxed">
                        {selectedNote.feynmanBreakdown.commonPitfall}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Markdown Note Content */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/80 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedNote.content}
                </div>

                {/* CTA to teach this topic again */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Connected to <strong>{selectedNote.topicTitle}</strong>
                  </span>
                  <Link href={`/teach?topic=${selectedNote.topicId}`}>
                    <Button size="sm" className="gap-1.5 text-xs shadow-sm">
                      <span>Re-Teach in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center text-muted-foreground text-xs">
              Select a note on the left or click New Active Note to record a synthesis.
            </Card>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Active Feynman Note"
        description="Synthesize a concept using plain-language analogies and common pitfall warnings."
      >
        <form onSubmit={handleCreateNote} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Note Title</label>
            <Input
              required
              placeholder="e.g. Self-Attention & Softmax Stability"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Target Topic</label>
            <Input
              placeholder="e.g. Self-Attention Mechanism"
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">1. Intuitive Everyday Analogy</label>
            <Textarea
              rows={2}
              placeholder="Explain it like you would to a 10-year-old..."
              value={newAnalogy}
              onChange={(e) => setNewAnalogy(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">2. Scientific Core Definition</label>
            <Textarea
              rows={2}
              placeholder="Formal, precise mathematical or algorithmic definition..."
              value={newDefinition}
              onChange={(e) => setNewDefinition(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">3. Common Misconception or Pitfall</label>
            <Input
              placeholder="What do students frequently get wrong?"
              value={newPitfall}
              onChange={(e) => setNewPitfall(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="shadow-md">
              Save Active Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
