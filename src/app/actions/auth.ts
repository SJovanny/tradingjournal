"use server";

// ============================================================================
// SERVER ACTIONS - Authentification
// ============================================================================

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

// Type pour les messages d'erreur
export type AuthActionResult = {
    error?: string;
    success?: boolean;
};

// ============================================================================
// LOGIN - Connexion Email/Password
// ============================================================================
export async function loginWithEmail(formData: FormData): Promise<AuthActionResult> {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

// ============================================================================
// REGISTER - Inscription Email/Password
// ============================================================================
export async function registerWithEmail(formData: FormData): Promise<AuthActionResult> {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    if (!email || !password) {
        return { error: "Email et mot de passe requis" };
    }

    if (password.length < 6) {
        return { error: "Le mot de passe doit contenir au moins 6 caractères" };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

// ============================================================================
// LOGIN GOOGLE - OAuth avec Google
// ============================================================================
export async function loginWithGoogle(): Promise<void> {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        redirect("/login?error=" + encodeURIComponent(error.message));
    }

    if (data.url) {
        redirect(data.url);
    }
}

// ============================================================================
// LOGOUT - Déconnexion
// ============================================================================
export async function logout(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

// ============================================================================
// GET USER - Récupérer l'utilisateur courant
// ============================================================================
export async function getCurrentUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ============================================================================
// GET PROFILE - Récupérer le profil utilisateur
// ============================================================================
export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return profile;
}
