"use server";

// ============================================================================
// ASSETS SERVER ACTIONS - CRUD operations for trading assets
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ============================================================================
// TYPES
// ============================================================================

export interface Asset {
    id: string;
    user_id: string | null;
    symbol: string;
    name: string | null;
    asset_type: "FOREX" | "CRYPTO" | "STOCK" | "ETF" | "COMMODITY" | "INDEX" | "OTHER";
    is_default: boolean;
    is_active: boolean;
    created_at: string;
}

interface CreateAssetInput {
    symbol: string;
    name?: string;
    asset_type: Asset["asset_type"];
}

interface ActionResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// ============================================================================
// GET USER ASSETS + DEFAULTS
// ============================================================================

export async function getUserAssets(): Promise<ActionResult<Asset[]>> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Non authentifié" };
        }

        // Fetch user assets + default assets (where user_id IS NULL)
        const { data, error } = await supabase
            .from("assets")
            .select("*")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .eq("is_active", true)
            .order("is_default", { ascending: false })
            .order("symbol", { ascending: true });

        if (error) {
            console.error("Error fetching assets:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as Asset[] };
    } catch (error) {
        console.error("getUserAssets error:", error);
        return { success: false, error: "Erreur lors de la récupération des actifs" };
    }
}

// ============================================================================
// CREATE ASSET
// ============================================================================

export async function createAsset(input: CreateAssetInput): Promise<ActionResult<Asset>> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Non authentifié" };
        }

        // Normalize symbol to uppercase
        const normalizedSymbol = input.symbol.toUpperCase().trim();

        // Check if asset already exists for this user or as default
        const { data: existing } = await supabase
            .from("assets")
            .select("id")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .eq("symbol", normalizedSymbol)
            .single();

        if (existing) {
            return { success: false, error: "Cet actif existe déjà" };
        }

        // Create the asset
        const { data, error } = await supabase
            .from("assets")
            .insert({
                user_id: user.id,
                symbol: normalizedSymbol,
                name: input.name?.trim() || null,
                asset_type: input.asset_type,
                is_default: false,
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating asset:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true, data: data as Asset };
    } catch (error) {
        console.error("createAsset error:", error);
        return { success: false, error: "Erreur lors de la création de l'actif" };
    }
}

// ============================================================================
// DELETE ASSET (user-created only)
// ============================================================================

export async function deleteAsset(assetId: string): Promise<ActionResult> {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "Non authentifié" };
        }

        // Delete only if it's the user's asset and not a default
        const { error } = await supabase
            .from("assets")
            .delete()
            .eq("id", assetId)
            .eq("user_id", user.id)
            .eq("is_default", false);

        if (error) {
            console.error("Error deleting asset:", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("deleteAsset error:", error);
        return { success: false, error: "Erreur lors de la suppression de l'actif" };
    }
}
