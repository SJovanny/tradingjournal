"use client";

// ============================================================================
// PORTFOLIO SELECTOR - Sélecteur de Compte de Trading
// ============================================================================

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, ChevronDown, Settings, TrendingUp, TrendingDown } from "lucide-react";

// Types
interface Portfolio {
    id: string;
    name: string;
    type: "DEMO" | "FUNDED" | "PERSONAL" | "PROP_FIRM";
    balance: number;
    currency: string;
    pnlToday: number;
    isDefault: boolean;
}

interface PortfolioSelectorProps {
    portfolios?: Portfolio[];
    selectedId?: string;
    onSelect?: (id: string) => void;
    onAddNew?: () => void;
}

// Mock data for demo
const mockPortfolios: Portfolio[] = [
    {
        id: "1",
        name: "Compte Principal",
        type: "PERSONAL",
        balance: 10250.50,
        currency: "EUR",
        pnlToday: 125.30,
        isDefault: true,
    },
    {
        id: "2",
        name: "FTMO 100K",
        type: "PROP_FIRM",
        balance: 102340.00,
        currency: "USD",
        pnlToday: -450.00,
        isDefault: false,
    },
    {
        id: "3",
        name: "Demo Trading",
        type: "DEMO",
        balance: 50000.00,
        currency: "EUR",
        pnlToday: 0,
        isDefault: false,
    },
];

const typeLabels: Record<string, { label: string; color: string }> = {
    DEMO: { label: "Demo", color: "bg-slate-500" },
    FUNDED: { label: "Funded", color: "bg-emerald-500" },
    PERSONAL: { label: "Personnel", color: "bg-blue-500" },
    PROP_FIRM: { label: "Prop Firm", color: "bg-purple-500" },
};

function formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

export function PortfolioSelector({
    portfolios = mockPortfolios,
    selectedId,
    onSelect,
    onAddNew,
}: PortfolioSelectorProps) {
    const [selected, setSelected] = useState(
        selectedId || portfolios.find((p) => p.isDefault)?.id || portfolios[0]?.id
    );

    const selectedPortfolio = portfolios.find((p) => p.id === selected);

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect?.(id);
    };

    if (!selectedPortfolio) {
        return (
            <Button variant="outline" onClick={onAddNew} className="gap-2">
                <Plus className="w-4 h-4" />
                Ajouter un compte
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="h-auto py-2 px-3 gap-3 min-w-[200px] justify-between bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            typeLabels[selectedPortfolio.type].color
                        )}>
                            <Wallet className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {selectedPortfolio.name}
                            </p>
                            <p className="text-xs text-slate-500">
                                {formatCurrency(selectedPortfolio.balance, selectedPortfolio.currency)}
                            </p>
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Mes Comptes</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onAddNew}>
                        <Plus className="w-3 h-3 mr-1" />
                        Nouveau
                    </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {portfolios.map((portfolio) => (
                    <DropdownMenuItem
                        key={portfolio.id}
                        onClick={() => handleSelect(portfolio.id)}
                        className={cn(
                            "flex items-center gap-3 py-3 cursor-pointer",
                            portfolio.id === selected && "bg-blue-50 dark:bg-blue-900/20"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            typeLabels[portfolio.type].color
                        )}>
                            <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                    {portfolio.name}
                                </p>
                                {portfolio.isDefault && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        Défaut
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                    {formatCurrency(portfolio.balance, portfolio.currency)}
                                </p>
                                <div className={cn(
                                    "flex items-center gap-0.5 text-xs font-medium",
                                    portfolio.pnlToday > 0 && "text-emerald-600",
                                    portfolio.pnlToday < 0 && "text-red-600",
                                    portfolio.pnlToday === 0 && "text-slate-400"
                                )}>
                                    {portfolio.pnlToday > 0 && <TrendingUp className="w-3 h-3" />}
                                    {portfolio.pnlToday < 0 && <TrendingDown className="w-3 h-3" />}
                                    {portfolio.pnlToday !== 0 && (
                                        <span>
                                            {portfolio.pnlToday > 0 ? "+" : ""}
                                            {formatCurrency(portfolio.pnlToday, portfolio.currency)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 text-slate-500">
                    <Settings className="w-4 h-4" />
                    Gérer les comptes
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
