"use client";

// ============================================================================
// DELETE ACCOUNT BUTTON - Bouton de suppression de compte avec confirmation
// ============================================================================

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteAccount } from "@/app/actions/auth";
import { toast } from "sonner";

export function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirmText !== "SUPPRIMER") {
            toast.error("Veuillez taper SUPPRIMER pour confirmer");
            return;
        }

        startTransition(async () => {
            const result = await deleteAccount();
            if (result?.error) {
                toast.error(result.error);
            }
            // If successful, the action will redirect to /login
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Supprimer mon compte
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        Cette action est <strong>irréversible</strong>. Toutes vos données seront supprimées :
                        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                            <li>Votre profil et vos préférences</li>
                            <li>Tous vos trades et leur historique</li>
                            <li>Vos stratégies et portefeuilles</li>
                            <li>Vos objectifs et notes</li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirm">
                            Tapez <strong className="text-red-600">SUPPRIMER</strong> pour confirmer
                        </Label>
                        <Input
                            id="confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="SUPPRIMER"
                            className="border-red-200 focus:border-red-500"
                            disabled={isPending}
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isPending}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={confirmText !== "SUPPRIMER" || isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Suppression...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer définitivement
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
