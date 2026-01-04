"use client";

// ============================================================================
// PROFILE FORM - Formulaire de modification du profil
// ============================================================================

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Loader2, Save } from "lucide-react";
import { updateProfile, type Profile } from "@/app/actions/profile";
import { toast } from "sonner";

interface ProfileFormProps {
    profile: Profile | null;
    userEmail: string | null;
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        phone: profile?.phone || "",
        dateOfBirth: profile?.date_of_birth || "",
        country: profile?.country || "",
        timezone: profile?.timezone || "UTC",
        preferredCurrency: profile?.preferred_currency || "USD",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        });

        startTransition(async () => {
            const result = await updateProfile(form);
            if (result.success) {
                toast.success("Profil mis à jour avec succès");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Profil
                </CardTitle>
                <CardDescription>
                    Modifiez vos informations personnelles
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email (read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={userEmail || ""}
                            disabled
                            className="bg-slate-50 dark:bg-slate-800"
                        />
                        <p className="text-xs text-slate-500">L&apos;email ne peut pas être modifié</p>
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+33 6 12 34 56 78"
                            disabled={isPending}
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date de naissance</Label>
                        <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            disabled={isPending}
                        />
                    </div>

                    {/* Country & Timezone */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="country">Pays</Label>
                            <select
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                disabled={isPending}
                            >
                                <option value="">Sélectionner...</option>
                                <option value="FR">France</option>
                                <option value="BE">Belgique</option>
                                <option value="CH">Suisse</option>
                                <option value="CA">Canada</option>
                                <option value="US">États-Unis</option>
                                <option value="GB">Royaume-Uni</option>
                                <option value="DE">Allemagne</option>
                                <option value="ES">Espagne</option>
                                <option value="IT">Italie</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="timezone">Fuseau horaire</Label>
                            <select
                                id="timezone"
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                disabled={isPending}
                            >
                                <option value="Europe/Paris">Paris (UTC+1)</option>
                                <option value="Europe/Brussels">Bruxelles (UTC+1)</option>
                                <option value="Europe/Zurich">Zurich (UTC+1)</option>
                                <option value="America/New_York">New York (UTC-5)</option>
                                <option value="America/Toronto">Toronto (UTC-5)</option>
                                <option value="America/Los_Angeles">Los Angeles (UTC-8)</option>
                                <option value="Europe/London">Londres (UTC+0)</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                    </div>

                    {/* Currency */}
                    <div className="space-y-2">
                        <Label htmlFor="preferredCurrency">Devise préférée</Label>
                        <select
                            id="preferredCurrency"
                            name="preferredCurrency"
                            value={formData.preferredCurrency}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            disabled={isPending}
                        >
                            <option value="EUR">EUR (€)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="CHF">CHF (Fr.)</option>
                            <option value="CAD">CAD ($)</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Enregistrer les modifications
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
