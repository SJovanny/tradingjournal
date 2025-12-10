// ============================================================================
// ANALYTICS PAGE - Analyses Détaillées
// ============================================================================

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Analytics
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Analysez vos performances en profondeur
                </p>
            </div>

            {/* Empty State */}
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Pas assez de données
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">
                        Ajoutez des trades pour commencer à voir vos statistiques et analyses
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
