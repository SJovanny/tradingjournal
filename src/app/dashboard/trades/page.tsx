// ============================================================================
// TRADES PAGE - Liste des Trades
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, LineChart } from "lucide-react";
import Link from "next/link";

export default function TradesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Mes Trades
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Gérez et analysez tous vos trades
                    </p>
                </div>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/dashboard/trades/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Nouveau Trade
                    </Link>
                </Button>
            </div>

            {/* Empty State */}
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <LineChart className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Aucun trade enregistré
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-6">
                        Commencez par ajouter votre premier trade pour suivre vos performances
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/trades/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter mon premier trade
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
