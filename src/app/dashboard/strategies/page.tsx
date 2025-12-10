// ============================================================================
// STRATEGIES PAGE - Playbook du Trader
// ============================================================================

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

export default function StrategiesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Stratégies
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Votre Playbook de trading
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Stratégie
                </Button>
            </div>

            {/* Empty State */}
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Aucune stratégie créée
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
                        Définissez vos setups et règles de trading pour suivre votre discipline
                    </p>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer ma première stratégie
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
