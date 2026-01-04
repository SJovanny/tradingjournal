// ============================================================================
// SERVER ACTIONS - Goals & Notes
// ============================================================================

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// TYPES
// ============================================================================

export interface TradingGoal {
    id: string;
    title: string;
    targetValue: number;
    currentValue: number;
    goalType: "profit" | "trades" | "winrate" | "custom";
    isCompleted: boolean;
}

export interface QuickNote {
    id: string;
    content: string;
    noteType: "thought" | "lesson" | "observation";
    pinned: boolean;
    createdAt: string;
}

type ActionResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

// ============================================================================
// GOALS ACTIONS
// ============================================================================

export async function getGoals(): Promise<ActionResult<TradingGoal[]>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { data, error } = await supabase
            .from("trading_goals")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching goals:", error);
            return { success: false, error: error.message };
        }

        const goals: TradingGoal[] = (data || []).map((g) => ({
            id: g.id,
            title: g.title,
            targetValue: Number(g.target_value),
            currentValue: Number(g.current_value),
            goalType: g.goal_type as TradingGoal["goalType"],
            isCompleted: g.is_completed,
        }));

        return { success: true, data: goals };
    } catch (error) {
        console.error("Unexpected error fetching goals:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function createGoal(goal: Partial<TradingGoal>): Promise<ActionResult<TradingGoal>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { data, error } = await supabase
            .from("trading_goals")
            .insert({
                user_id: user.id,
                title: goal.title || "Nouvel Objectif",
                target_value: goal.targetValue || 0,
                current_value: goal.currentValue || 0,
                goal_type: goal.goalType || "custom",
                is_completed: goal.isCompleted || false,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating goal:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");

        return {
            success: true,
            data: {
                id: data.id,
                title: data.title,
                targetValue: Number(data.target_value),
                currentValue: Number(data.current_value),
                goalType: data.goal_type as TradingGoal["goalType"],
                isCompleted: data.is_completed,
            },
        };
    } catch (error) {
        console.error("Unexpected error creating goal:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function updateGoal(
    id: string,
    updates: Partial<TradingGoal>
): Promise<ActionResult<void>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        // Map frontend camelCase to DB snake_case
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.targetValue !== undefined) dbUpdates.target_value = updates.targetValue;
        if (updates.currentValue !== undefined) dbUpdates.current_value = updates.currentValue;
        if (updates.goalType !== undefined) dbUpdates.goal_type = updates.goalType;
        if (updates.isCompleted !== undefined) dbUpdates.is_completed = updates.isCompleted;

        const { error } = await supabase
            .from("trading_goals")
            .update(dbUpdates)
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error updating goal:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("Unexpected error updating goal:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function deleteGoal(id: string): Promise<ActionResult<void>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { error } = await supabase
            .from("trading_goals")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting goal:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("Unexpected error deleting goal:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

// ============================================================================
// NOTES ACTIONS
// ============================================================================

export async function getNotes(): Promise<ActionResult<QuickNote[]>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { data, error } = await supabase
            .from("quick_notes")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching notes:", error);
            return { success: false, error: error.message };
        }

        const notes: QuickNote[] = (data || []).map((n) => ({
            id: n.id,
            content: n.content,
            noteType: n.note_type as QuickNote["noteType"],
            pinned: n.pinned,
            createdAt: n.created_at,
        }));

        return { success: true, data: notes };
    } catch (error) {
        console.error("Unexpected error fetching notes:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function createNote(content: string, type: QuickNote["noteType"] = "thought"): Promise<ActionResult<QuickNote>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { data, error } = await supabase
            .from("quick_notes")
            .insert({
                user_id: user.id,
                content,
                note_type: type,
                pinned: false,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating note:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");

        return {
            success: true,
            data: {
                id: data.id,
                content: data.content,
                noteType: data.note_type as QuickNote["noteType"],
                pinned: data.pinned,
                createdAt: data.created_at,
            },
        };
    } catch (error) {
        console.error("Unexpected error creating note:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function deleteNote(id: string): Promise<ActionResult<void>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { error } = await supabase
            .from("quick_notes")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error deleting note:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("Unexpected error deleting note:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

export async function togglePinNote(id: string, currentStatus: boolean): Promise<ActionResult<void>> {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { error } = await supabase
            .from("quick_notes")
            .update({ pinned: !currentStatus })
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error toggling pin:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("Unexpected error toggling pin:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}
