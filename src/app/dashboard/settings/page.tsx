// ============================================================================
// SETTINGS PAGE - Paramètres
// ============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Wallet, Bell, Shield } from "lucide-react";
import { DeleteAccountButton } from "@/components/settings/DeleteAccountButton";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { getProfile } from "@/app/actions/profile";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch profile data
    const profileResult = await getProfile();
    const profile = profileResult.success ? profileResult.data : null;

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Paramètres
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Gérez votre compte et vos préférences
                </p>
            </div>

            {/* Profile Section - Now uses ProfileForm */}
            <ProfileForm profile={profile} userEmail={user?.email || null} />

            {/* Portfolios Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-600" />
                        Portefeuilles
                    </CardTitle>
                    <CardDescription>
                        Gérez vos comptes de trading
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400 mb-4">
                            Aucun portefeuille configuré
                        </p>
                        <Button variant="outline">
                            Ajouter un portefeuille
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                        Notifications
                    </CardTitle>
                    <CardDescription>
                        Configurez vos alertes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                        Fonctionnalité bientôt disponible
                    </p>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card className="border-red-200 dark:border-red-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <Shield className="w-5 h-5" />
                        Zone Danger
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Supprimer mon compte</p>
                            <p className="text-sm text-slate-500">Cette action est irréversible</p>
                        </div>
                        <DeleteAccountButton />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
