"use server";

// ============================================================================
// SERVER ACTIONS - Profile Management
// ============================================================================

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ============================================================================
// TYPES
// ============================================================================

export interface Profile {
    id: string;
    user_id: string;
    email: string | null;
    phone: string | null;
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    country: string | null;
    timezone: string | null;
    preferred_currency: string | null;
    subscription_tier: "FREE" | "PRO" | "ENTERPRISE";
    onboarding_completed: boolean;
}

export type ProfileActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string };

// ============================================================================
// GET PROFILE - Récupérer le profil utilisateur
// ============================================================================
export async function getProfile(): Promise<ProfileActionResult<Profile | null>> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Error fetching profile:", error);
            return { success: false, error: "Erreur lors de la récupération du profil" };
        }

        return { success: true, data: profile };
    } catch (error) {
        console.error("Unexpected error getting profile:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}

// ============================================================================
// UPDATE PROFILE - Mettre à jour le profil utilisateur
// ============================================================================
export async function updateProfile(formData: FormData): Promise<ProfileActionResult> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Non authentifié" };
        }

        // Extract form data
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const phone = formData.get("phone") as string;
        const dateOfBirth = formData.get("dateOfBirth") as string;
        const country = formData.get("country") as string;
        const timezone = formData.get("timezone") as string;
        const preferredCurrency = formData.get("preferredCurrency") as string;

        // Build display name
        const displayName = `${firstName || ""} ${lastName || ""}`.trim() || null;

        // Update profile
        const { error } = await supabase
            .from("profiles")
            .update({
                first_name: firstName || null,
                last_name: lastName || null,
                display_name: displayName,
                phone: phone || null,
                date_of_birth: dateOfBirth || null,
                country: country || null,
                timezone: timezone || "UTC",
                preferred_currency: preferredCurrency || "USD",
            })
            .eq("user_id", user.id);

        if (error) {
            console.error("Error updating profile:", error);
            return { success: false, error: "Erreur lors de la mise à jour du profil" };
        }

        revalidatePath("/dashboard/settings");
        return { success: true, data: undefined };
    } catch (error) {
        console.error("Unexpected error updating profile:", error);
        return { success: false, error: "Erreur inattendue" };
    }
}
