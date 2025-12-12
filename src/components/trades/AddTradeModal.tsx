"use client";

// ============================================================================
// ADD TRADE MODAL - Modal d'ajout de trade avec documentation
// ============================================================================

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    X,
    ImageIcon,
    TrendingUp,
    MessageSquare,
    ChartCandlestick,
    Loader2,
    Brain,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    TradePropertiesForm,
    type TradeProperties,
    DEFAULT_TRADE_PROPERTIES,
} from "./TradePropertiesForm";
import { EMOTION_TAGS } from "@/lib/validations/tradeSchema";

// ============================================================================
// TYPES
// ============================================================================

interface Portfolio {
    id: string;
    name: string;
    portfolio_type: string;
}

interface AddTradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedDate: Date;
    portfolios?: Portfolio[];
    onSubmit?: (data: TradeDocumentation) => void;
}

interface ScreenshotField {
    id: string;
    label: string;
    timeframe: string;
    file: File | null;
    preview: string | null;
}

interface TradeDocumentation {
    date: Date;
    properties: TradeProperties;
    screenshots: {
        h4?: File;
        m15?: File;
        h1?: File;
        m5?: File;
        entryM1?: File;
        exitM1?: File;
    };
    entryReason: string;
    postAnalysis: string;
}

// ============================================================================
// SCREENSHOT UPLOAD COMPONENT
// ============================================================================

interface ScreenshotUploadProps {
    label: string;
    timeframe: string;
    file: File | null;
    preview: string | null;
    onFileSelect: (file: File | null) => void;
}

function ScreenshotUpload({
    label,
    timeframe,
    file,
    preview,
    onFileSelect,
}: ScreenshotUploadProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                onFileSelect(files[0]);
            }
        },
        [onFileSelect]
    );

    const handleRemove = useCallback(() => {
        onFileSelect(null);
    }, [onFileSelect]);

    const inputId = `screenshot-${label.replace(/\s+/g, "-").toLowerCase()}`;

    if (preview) {
        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {label} <span className="text-xs text-blue-500">({timeframe})</span>
                </Label>
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img
                        src={preview}
                        alt={label}
                        className="w-full h-24 object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-1 right-1 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {label} <span className="text-xs text-blue-500">({timeframe})</span>
            </Label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                    isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id={inputId}
                />
                <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center gap-1">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-500">Cliquez ou déposez</span>
                </label>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN MODAL COMPONENT
// ============================================================================

export function AddTradeModal({
    open,
    onOpenChange,
    selectedDate,
    portfolios = [],
    onSubmit,
}: AddTradeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [entryReason, setEntryReason] = useState("");
    const [postAnalysis, setPostAnalysis] = useState("");
    const [tradeProperties, setTradeProperties] = useState<TradeProperties>({
        ...DEFAULT_TRADE_PROPERTIES,
        portfolioId: portfolios[0]?.id || "",
    });

    // Screenshot states
    const [screenshots, setScreenshots] = useState<{
        h4: { file: File | null; preview: string | null };
        m15: { file: File | null; preview: string | null };
        h1: { file: File | null; preview: string | null };
        m5: { file: File | null; preview: string | null };
        entryM1: { file: File | null; preview: string | null };
        exitM1: { file: File | null; preview: string | null };
    }>({
        h4: { file: null, preview: null },
        m15: { file: null, preview: null },
        h1: { file: null, preview: null },
        m5: { file: null, preview: null },
        entryM1: { file: null, preview: null },
        exitM1: { file: null, preview: null },
    });

    const handleScreenshotChange = useCallback(
        (key: keyof typeof screenshots) => (file: File | null) => {
            if (file) {
                const preview = URL.createObjectURL(file);
                setScreenshots((prev) => ({
                    ...prev,
                    [key]: { file, preview },
                }));
            } else {
                setScreenshots((prev) => {
                    if (prev[key].preview) {
                        URL.revokeObjectURL(prev[key].preview!);
                    }
                    return {
                        ...prev,
                        [key]: { file: null, preview: null },
                    };
                });
            }
        },
        []
    );

    const toggleEmotion = (emotion: string) => {
        setTradeProperties((prev) => {
            const currentEmotions = prev.emotions || [];
            const newEmotions = currentEmotions.includes(emotion)
                ? currentEmotions.filter((e) => e !== emotion)
                : [...currentEmotions, emotion];
            return { ...prev, emotions: newEmotions };
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const data: TradeDocumentation = {
                date: selectedDate,
                properties: tradeProperties,
                screenshots: {
                    h4: screenshots.h4.file || undefined,
                    m15: screenshots.m15.file || undefined,
                    h1: screenshots.h1.file || undefined,
                    m5: screenshots.m5.file || undefined,
                    entryM1: screenshots.entryM1.file || undefined,
                    exitM1: screenshots.exitM1.file || undefined,
                },
                entryReason,
                postAnalysis,
            };
            onSubmit?.(data);
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Cleanup previews
        Object.values(screenshots).forEach((s) => {
            if (s.preview) URL.revokeObjectURL(s.preview);
        });
        // Reset state
        setScreenshots({
            h4: { file: null, preview: null },
            m15: { file: null, preview: null },
            h1: { file: null, preview: null },
            m5: { file: null, preview: null },
            entryM1: { file: null, preview: null },
            exitM1: { file: null, preview: null },
        });
        setEntryReason("");
        setPostAnalysis("");
        setTradeProperties({ ...DEFAULT_TRADE_PROPERTIES, portfolioId: portfolios[0]?.id || "" });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ChartCandlestick className="w-5 h-5 text-blue-600" />
                        Documenter un Trade
                    </DialogTitle>
                    <p className="text-sm text-slate-500">
                        {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                    </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-2">
                    {/* Trade Properties Form */}
                    <TradePropertiesForm
                        value={tradeProperties}
                        onChange={setTradeProperties}
                        portfolios={portfolios}
                    />

                    <Separator />

                    {/* Vue d'ensemble - Screenshots */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <TrendingUp className="w-4 h-4" />
                            Vue d'ensemble du trade
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <ScreenshotUpload
                                label="Vue d'ensemble"
                                timeframe="H4"
                                file={screenshots.h4.file}
                                preview={screenshots.h4.preview}
                                onFileSelect={handleScreenshotChange("h4")}
                            />
                            <ScreenshotUpload
                                label="Vue d'ensemble"
                                timeframe="H1"
                                file={screenshots.h1.file}
                                preview={screenshots.h1.preview}
                                onFileSelect={handleScreenshotChange("h1")}
                            />
                            <ScreenshotUpload
                                label="Vue d'ensemble"
                                timeframe="M15"
                                file={screenshots.m15.file}
                                preview={screenshots.m15.preview}
                                onFileSelect={handleScreenshotChange("m15")}
                            />
                            <ScreenshotUpload
                                label="Vue d'ensemble"
                                timeframe="M5"
                                file={screenshots.m5.file}
                                preview={screenshots.m5.preview}
                                onFileSelect={handleScreenshotChange("m5")}
                            />
                        </div>
                    </div>

                    {/* Prise de position */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <ChartCandlestick className="w-4 h-4 text-emerald-500" />
                            Prise de position
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ScreenshotUpload
                                label="Graphique d'entrée"
                                timeframe="M1"
                                file={screenshots.entryM1.file}
                                preview={screenshots.entryM1.preview}
                                onFileSelect={handleScreenshotChange("entryM1")}
                            />
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    Pourquoi tu es rentré en position ?
                                </Label>
                                <Textarea
                                    value={entryReason}
                                    onChange={(e) => setEntryReason(e.target.value)}
                                    placeholder="Décris ta raison d'entrée..."
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clôture de position */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <ChartCandlestick className="w-4 h-4 text-red-500" />
                            Clôture de position
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ScreenshotUpload
                                label="Graphique de sortie"
                                timeframe="M1"
                                file={screenshots.exitM1.file}
                                preview={screenshots.exitM1.preview}
                                onFileSelect={handleScreenshotChange("exitM1")}
                            />
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    Analyse du trade après-coup
                                </Label>
                                <Textarea
                                    value={postAnalysis}
                                    onChange={(e) => setPostAnalysis(e.target.value)}
                                    placeholder="Qu'as-tu appris de ce trade ?"
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Emotions */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            <Brain className="w-4 h-4 text-purple-500" />
                            Psychologie & Émotions
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {EMOTION_TAGS.map((e) => (
                                <Badge
                                    key={e.value}
                                    variant={
                                        tradeProperties.emotions?.includes(e.value)
                                            ? "default"
                                            : "outline"
                                    }
                                    className={cn(
                                        "cursor-pointer transition-all hover:opacity-80",
                                        tradeProperties.emotions?.includes(e.value)
                                            ? e.color
                                            : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                    onClick={() => toggleEmotion(e.value)}
                                >
                                    {e.label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer le trade"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
