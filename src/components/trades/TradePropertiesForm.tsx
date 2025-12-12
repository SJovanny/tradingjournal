"use client";

// ============================================================================
// TRADE PROPERTIES FORM - All trade entry fields in a compact grid
// ============================================================================

import { useState, useMemo, useEffect } from "react";
import {
    TrendingUp,
    TrendingDown,
    Calculator,
    Percent,
    DollarSign,
    Brain,
    Target,
    Settings2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { AssetSelector } from "./AssetSelector";
import {
    TRADING_SESSIONS,
    TRADE_RESULTS,
    PSYCHOLOGICAL_BIASES,
    CONFLUENCES,
    EMOTION_TAGS,
} from "@/lib/validations/tradeSchema";

// ============================================================================
// TYPES
// ============================================================================

export interface TradeProperties {
    // Trade info
    asset: string;
    direction: "LONG" | "SHORT";
    portfolioId: string;
    session: string;

    // Risk & Performance
    riskPercent: string;
    rrRatio: string;
    grossPnl: string;
    commission: string;

    // Result
    result: "PROFIT" | "LOSS" | "BREAKEVEN" | "";
    confluences: string[];

    // Psychology
    emotions: string[];
    psychologicalBias: string;
}

interface Portfolio {
    id: string;
    name: string;
    portfolio_type: string;
}

interface TradePropertiesFormProps {
    value: TradeProperties;
    onChange: (value: TradeProperties) => void;
    portfolios: Portfolio[];
}

// ============================================================================
// COMPACT FIELD COMPONENT (DRY)
// ============================================================================

interface FieldProps {
    label: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
}

function Field({ label, children, icon, className }: FieldProps) {
    return (
        <div className={cn("space-y-1", className)}>
            <Label className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                {icon}
                {label}
            </Label>
            {children}
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TradePropertiesForm({
    value,
    onChange,
    portfolios,
}: TradePropertiesFormProps) {
    // Calculate Net PnL
    const netPnl = useMemo(() => {
        const gross = parseFloat(value.grossPnl) || 0;
        const commission = parseFloat(value.commission) || 0;
        return gross - commission;
    }, [value.grossPnl, value.commission]);

    // Counters based on result
    const resultCounters = useMemo(() => {
        return {
            win: value.result === "PROFIT" ? 1 : 0,
            loss: value.result === "LOSS" ? 1 : 0,
            breakeven: value.result === "BREAKEVEN" ? 1 : 0,
        };
    }, [value.result]);

    // Update handler (DRY)
    const updateField = <K extends keyof TradeProperties>(
        field: K,
        fieldValue: TradeProperties[K]
    ) => {
        onChange({ ...value, [field]: fieldValue });
    };

    // Toggle array items (DRY for multi-select)
    const toggleArrayItem = (field: "confluences" | "emotions", item: string) => {
        const currentArray = value[field] || [];
        const newArray = currentArray.includes(item)
            ? currentArray.filter((i) => i !== item)
            : [...currentArray, item];
        updateField(field, newArray);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Settings2 className="w-4 h-4" />
                Propriétés du Trade
            </div>

            {/* Main Properties Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Asset / Paires */}
                <Field label="Paire / Actif" icon={<Target className="w-3 h-3" />}>
                    <AssetSelector
                        value={value.asset}
                        onChange={(v) => updateField("asset", v)}
                        placeholder="Sélectionner..."
                    />
                </Field>

                {/* Direction */}
                <Field label="Direction">
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            size="sm"
                            variant={value.direction === "LONG" ? "default" : "outline"}
                            className={cn(
                                "flex-1 h-9",
                                value.direction === "LONG" &&
                                "bg-emerald-600 hover:bg-emerald-700"
                            )}
                            onClick={() => updateField("direction", "LONG")}
                        >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Long
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant={value.direction === "SHORT" ? "default" : "outline"}
                            className={cn(
                                "flex-1 h-9",
                                value.direction === "SHORT" &&
                                "bg-red-600 hover:bg-red-700"
                            )}
                            onClick={() => updateField("direction", "SHORT")}
                        >
                            <TrendingDown className="w-3 h-3 mr-1" />
                            Short
                        </Button>
                    </div>
                </Field>

                {/* Portfolio / Compte */}
                <Field label="Compte">
                    <Select
                        value={value.portfolioId}
                        onValueChange={(v) => updateField("portfolioId", v)}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            {portfolios.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                {/* Session */}
                <Field label="Session">
                    <Select
                        value={value.session}
                        onValueChange={(v) => updateField("session", v)}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            {TRADING_SESSIONS.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                {/* Risk % */}
                <Field label="% Risk" icon={<Percent className="w-3 h-3" />}>
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={value.riskPercent}
                        onChange={(e) => updateField("riskPercent", e.target.value)}
                        placeholder="1.0"
                        className="h-9"
                    />
                </Field>

                {/* RR Ratio */}
                <Field label="RR Ratio" icon={<Calculator className="w-3 h-3" />}>
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={value.rrRatio}
                        onChange={(e) => updateField("rrRatio", e.target.value)}
                        placeholder="2.0"
                        className="h-9"
                    />
                </Field>

                {/* PnL Brut */}
                <Field label="PnL Brut" icon={<DollarSign className="w-3 h-3" />}>
                    <Input
                        type="number"
                        step="0.01"
                        value={value.grossPnl}
                        onChange={(e) => updateField("grossPnl", e.target.value)}
                        placeholder="0.00"
                        className="h-9"
                    />
                </Field>

                {/* Commission */}
                <Field label="Commission" icon={<DollarSign className="w-3 h-3" />}>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={value.commission}
                        onChange={(e) => updateField("commission", e.target.value)}
                        placeholder="0.00"
                        className="h-9"
                    />
                </Field>
            </div>

            {/* PnL Net (calculated) & Result */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* PnL Net - Display Only */}
                <Field label="PnL Net">
                    <div
                        className={cn(
                            "h-9 px-3 flex items-center rounded-md border font-semibold text-sm",
                            netPnl > 0
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                : netPnl < 0
                                    ? "bg-red-500/10 border-red-500/30 text-red-600"
                                    : "bg-muted border-border text-muted-foreground"
                        )}
                    >
                        {netPnl >= 0 ? "+" : ""}
                        {netPnl.toFixed(2)} $
                    </div>
                </Field>

                {/* Result */}
                <Field label="Résultat">
                    <Select
                        value={value.result}
                        onValueChange={(v) =>
                            updateField("result", v as TradeProperties["result"])
                        }
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            {TRADE_RESULTS.map((r) => (
                                <SelectItem key={r.value} value={r.value}>
                                    {r.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                {/* Psychological Bias */}
                <Field label="Biais Psychologique" icon={<Brain className="w-3 h-3" />}>
                    <Select
                        value={value.psychologicalBias}
                        onValueChange={(v) => updateField("psychologicalBias", v)}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue placeholder="Aucun" />
                        </SelectTrigger>
                        <SelectContent>
                            {PSYCHOLOGICAL_BIASES.map((b) => (
                                <SelectItem key={b.value} value={b.value}>
                                    {b.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>

                {/* Result counters */}
                <div className="flex items-end gap-2 pb-0.5">
                    <div className="text-center">
                        <span className="text-xs text-muted-foreground">Win</span>
                        <Badge
                            variant="outline"
                            className="ml-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        >
                            {resultCounters.win}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-muted-foreground">Loss</span>
                        <Badge
                            variant="outline"
                            className="ml-1 bg-red-500/10 text-red-600 border-red-500/30"
                        >
                            {resultCounters.loss}
                        </Badge>
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-muted-foreground">BE</span>
                        <Badge
                            variant="outline"
                            className="ml-1 bg-gray-500/10 text-gray-600 border-gray-500/30"
                        >
                            {resultCounters.breakeven}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Confluences */}
            <Field label="Confluences" className="col-span-full">
                <div className="flex flex-wrap gap-1.5">
                    {CONFLUENCES.map((c) => (
                        <Badge
                            key={c.value}
                            variant={
                                value.confluences?.includes(c.value)
                                    ? "default"
                                    : "outline"
                            }
                            className={cn(
                                "cursor-pointer transition-all text-xs",
                                value.confluences?.includes(c.value)
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "hover:bg-accent"
                            )}
                            onClick={() => toggleArrayItem("confluences", c.value)}
                        >
                            {c.label}
                        </Badge>
                    ))}
                </div>
            </Field>
        </div>
    );
}

// ============================================================================
// DEFAULT VALUES (for initialization)
// ============================================================================

export const DEFAULT_TRADE_PROPERTIES: TradeProperties = {
    asset: "",
    direction: "LONG",
    portfolioId: "",
    session: "",
    riskPercent: "",
    rrRatio: "",
    grossPnl: "",
    commission: "",
    result: "",
    confluences: [],
    emotions: [],
    psychologicalBias: "",
};
