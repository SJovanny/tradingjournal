// ============================================================================
// SETTINGS PAGE - Paramètres
// ============================================================================

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { User, Wallet, Bell, Shield, Palette } from "lucide-react";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Profil
                    </CardTitle>
                    <CardDescription>
                        Informations de votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-slate-50 dark:bg-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input
                                id="name"
                                defaultValue={user?.user_metadata?.full_name || ""}
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <Button>Enregistrer les modifications</Button>
                </CardContent>
            </Card>

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

            {/* Preferences Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-purple-600" />
                        Préférences
                    </CardTitle>
                    <CardDescription>
                        Personnalisez votre expérience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Devise par défaut</p>
                            <p className="text-sm text-slate-500">Devise utilisée pour les calculs</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                        </select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">Fuseau horaire</p>
                            <p className="text-sm text-slate-500">Pour les dates de trades</p>
                        </div>
                        <select className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <option value="Europe/Paris">Paris (UTC+1)</option>
                            <option value="America/New_York">New York (UTC-5)</option>
                            <option value="UTC">UTC</option>
                        </select>
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
                        <Button variant="destructive">
                            Supprimer
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
