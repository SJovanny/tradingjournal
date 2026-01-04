"use client";

// ============================================================================
// GOALS & NOTES PANEL - Objectifs de trading et notes rapides
// ============================================================================

import { useState, useRef, useTransition } from "react";
import {
    Target,
    Plus,
    Pin,
    Trash2,
    MessageSquare,
    TrendingUp,
    Pencil,
    Check,
    X,
    Loader2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    createGoal,
    updateGoal,
    deleteGoal,
    createNote,
    deleteNote,
    togglePinNote,
    type TradingGoal,
    type QuickNote
} from "@/app/actions/goals-notes";
import { toast } from "sonner";

// ============================================================================
// TYPES
// ============================================================================

interface GoalsNotesPanelProps {
    goals?: TradingGoal[];
    notes?: QuickNote[];
}

// ============================================================================
// COMPONENTS
// ============================================================================

interface GoalItemProps {
    goal: TradingGoal;
}

function GoalItem({ goal }: GoalItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [editTitle, setEditTitle] = useState(goal.title);
    const [editCurrent, setEditCurrent] = useState(goal.currentValue.toString());
    const [editTarget, setEditTarget] = useState(goal.targetValue.toString());

    const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateGoal(goal.id, {
                title: editTitle,
                currentValue: parseFloat(editCurrent) || 0,
                targetValue: parseFloat(editTarget) || 1,
            });

            if (result.success) {
                toast.success("Objectif mis à jour");
                setIsEditing(false);
            } else {
                toast.error("Erreur lors de la mise à jour");
            }
        });
    };

    const handleDelete = () => {
        if (confirm("Supprimer cet objectif ?")) {
            startTransition(async () => {
                const result = await deleteGoal(goal.id);
                if (result.success) {
                    toast.success("Objectif supprimé");
                } else {
                    toast.error("Erreur lors de la suppression");
                }
            });
        }
    };

    const handleCancel = () => {
        setEditTitle(goal.title);
        setEditCurrent(goal.currentValue.toString());
        setEditTarget(goal.targetValue.toString());
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="space-y-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Titre de l'objectif"
                    className="h-7 text-sm"
                    disabled={isPending}
                />
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Actuel</label>
                        <Input
                            type="number"
                            value={editCurrent}
                            onChange={(e) => setEditCurrent(e.target.value)}
                            className="h-7 text-sm"
                            disabled={isPending}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground">Objectif</label>
                        <Input
                            type="number"
                            value={editTarget}
                            onChange={(e) => setEditTarget(e.target.value)}
                            className="h-7 text-sm"
                            disabled={isPending}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-1">
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="default"
                        className="h-6 px-2"
                        onClick={handleSave}
                        disabled={isPending}
                    >
                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="group space-y-1.5">
            <div className="flex items-center justify-between text-sm">
                <span className={cn(goal.isCompleted && "text-emerald-600")}>
                    {goal.title}
                </span>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                        {goal.currentValue}/{goal.targetValue}
                    </span>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity"
                    >
                        <Pencil className="w-3 h-3 text-slate-500" />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-opacity"
                    >
                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    </button>
                </div>
            </div>
            <Progress
                value={progress}
                className={cn(
                    "h-2",
                    goal.isCompleted && "[&>div]:bg-emerald-500"
                )}
            />
        </div>
    );
}

function NoteItem({
    note
}: {
    note: QuickNote;
}) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteNote(note.id);
            if (result.success) {
                toast.success("Note supprimée");
            } else {
                toast.error("Erreur lors de la suppression");
            }
        });
    };

    const handleTogglePin = () => {
        startTransition(async () => {
            const result = await togglePinNote(note.id, note.pinned);
            if (!result.success) {
                toast.error("Erreur lors de la modification");
            }
        });
    };

    return (
        <div
            className={cn(
                "group flex items-start gap-2 p-2 rounded-lg transition-colors",
                note.pinned
                    ? "bg-amber-50 dark:bg-amber-900/10"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            )}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 break-words">
                    {note.content}
                </p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleTogglePin}
                    disabled={isPending}
                    className={cn(
                        "p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700",
                        note.pinned && "text-amber-500"
                    )}
                >
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Pin className="w-3 h-3" />}
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="p-1 rounded hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                >
                    {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                </button>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function GoalsNotesPanel({
    goals = [],
    notes = []
}: GoalsNotesPanelProps) {
    const [newNote, setNewNote] = useState("");
    const [isGoalsPending, startGoalsTransition] = useTransition();
    const [isNotesPending, startNotesTransition] = useTransition();

    const handleAddGoal = () => {
        startGoalsTransition(async () => {
            const result = await createGoal({
                title: "Nouvel Objectif",
                targetValue: 100,
                currentValue: 0,
                goalType: "custom"
            });

            if (result.success) {
                toast.success("Objectif créé");
            } else {
                toast.error("Erreur lors de la création");
            }
        });
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            startNotesTransition(async () => {
                const result = await createNote(newNote.trim());
                if (result.success) {
                    setNewNote("");
                    toast.success("Note ajoutée");
                } else {
                    toast.error("Erreur lors de l'ajout de la note");
                }
            });
        }
    };

    const sortedNotes = [...notes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Objectifs & Notes
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Goals Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" />
                            Objectifs
                        </h3>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                            onClick={handleAddGoal}
                            disabled={isGoalsPending}
                        >
                            {isGoalsPending ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                                <Plus className="w-3 h-3 mr-1" />
                            )}
                            Ajouter
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {goals.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-2">Aucun objectif défini</p>
                        ) : (
                            goals.map((goal) => (
                                <GoalItem
                                    key={goal.id}
                                    goal={goal}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-slate-700" />

                {/* Notes Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        Notes Rapides
                    </h3>

                    {/* Add Note Input */}
                    <div className="flex gap-2 mb-2">
                        <Input
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Nouvelle note..."
                            className="h-8 text-sm"
                            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                            disabled={isNotesPending}
                        />
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 px-2"
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || isNotesPending}
                        >
                            {isNotesPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                        </Button>
                    </div>

                    {/* Notes List */}
                    <ScrollArea className="flex-1 -mx-2">
                        <div className="space-y-1 px-2">
                            {sortedNotes.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-4">Aucune note</p>
                            ) : (
                                sortedNotes.map((note) => (
                                    <NoteItem
                                        key={note.id}
                                        note={note}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}

