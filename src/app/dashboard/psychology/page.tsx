// ============================================================================
// PSYCHOLOGY PAGE - Suivi Psychologique
// ============================================================================

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Smile, Frown, Meh, TrendingUp, TrendingDown } from "lucide-react";

export default function PsychologyPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Psychologie
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Tiltmeter et suivi émotionnel
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/20">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                            <Smile className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">État Calme</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">0 trades</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-xl flex items-center justify-center">
                            <Meh className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">État Anxieux</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">0 trades</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/20">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-xl flex items-center justify-center">
                            <Frown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">État TILT</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">0 trades</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tiltmeter */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Tiltmeter
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8">
                    <div className="relative w-48 h-24 mb-4">
                        {/* Gauge background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-t-full opacity-20" />
                        {/* Needle */}
                        <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-slate-900 dark:bg-white origin-bottom -translate-x-1/2 rounded-full" style={{ transform: 'translateX(-50%) rotate(-45deg)' }} />
                    </div>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        Stable
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                        Votre niveau de tilt actuel
                    </p>
                </CardContent>
            </Card>

            {/* Performance by Emotion */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance par État Émotionnel</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Brain className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-center">
                        Enregistrez vos émotions lors de vos trades pour voir votre performance par état
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
