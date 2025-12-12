"use client";

// ============================================================================
// ASSET SELECTOR - Dropdown with user assets + create new option
// ============================================================================

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Loader2, X, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { getUserAssets, createAsset, type Asset } from "@/app/actions/assets";
import { ASSET_TYPES } from "@/lib/validations/tradeSchema";

// ============================================================================
// TYPES
// ============================================================================

interface AssetSelectorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AssetSelector({
    value,
    onChange,
    placeholder = "Sélectionner un actif...",
    disabled = false,
}: AssetSelectorProps) {
    const [open, setOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [creating, setCreating] = useState(false);

    // New asset form state
    const [newSymbol, setNewSymbol] = useState("");
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState<Asset["asset_type"]>("FOREX");

    // Load assets
    const loadAssets = useCallback(async () => {
        setLoading(true);
        const result = await getUserAssets();
        if (result.success && result.data) {
            setAssets(result.data);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadAssets();
    }, [loadAssets]);

    // Filter assets by search query
    const filteredAssets = assets.filter(
        (asset) =>
            asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            asset.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group assets by type
    const groupedAssets = filteredAssets.reduce((acc, asset) => {
        const type = asset.asset_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(asset);
        return acc;
    }, {} as Record<string, Asset[]>);

    // Get selected asset
    const selectedAsset = assets.find((a) => a.symbol === value);

    // Handle asset creation
    const handleCreateAsset = async () => {
        if (!newSymbol.trim()) return;

        setCreating(true);
        const result = await createAsset({
            symbol: newSymbol,
            name: newName || undefined,
            asset_type: newType,
        });

        if (result.success && result.data) {
            setAssets((prev) => [...prev, result.data!]);
            onChange(result.data.symbol);
            setCreateDialogOpen(false);
            setOpen(false);
            resetNewAssetForm();
        }
        setCreating(false);
    };

    const resetNewAssetForm = () => {
        setNewSymbol("");
        setNewName("");
        setNewType("FOREX");
    };

    const getTypeLabel = (type: string) => {
        return ASSET_TYPES.find((t) => t.value === type)?.label || type;
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        {selectedAsset ? (
                            <span className="flex items-center gap-2">
                                <span className="font-semibold">{selectedAsset.symbol}</span>
                                {selectedAsset.name && (
                                    <span className="text-xs text-muted-foreground truncate">
                                        {selectedAsset.name}
                                    </span>
                                )}
                            </span>
                        ) : (
                            placeholder
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    {/* Search */}
                    <div className="flex items-center border-b px-3 py-2">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Input
                            placeholder="Rechercher un actif..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-0 focus-visible:ring-0 h-8 p-0"
                        />
                    </div>

                    {/* Assets list */}
                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredAssets.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Aucun actif trouvé
                            </div>
                        ) : (
                            Object.entries(groupedAssets).map(([type, typeAssets]) => (
                                <div key={type} className="mb-2">
                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                        {getTypeLabel(type)}
                                    </div>
                                    {typeAssets.map((asset) => (
                                        <button
                                            key={asset.id}
                                            onClick={() => {
                                                onChange(asset.symbol);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground",
                                                value === asset.symbol && "bg-accent"
                                            )}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className="font-medium">{asset.symbol}</span>
                                                {asset.name && (
                                                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                        {asset.name}
                                                    </span>
                                                )}
                                            </span>
                                            {value === asset.symbol && (
                                                <Check className="h-4 w-4" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add new button */}
                    <div className="border-t p-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-sm"
                            onClick={() => {
                                setCreateDialogOpen(true);
                                setOpen(false);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                            Ajouter un nouvel actif
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Create Asset Dialog */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            Nouvel Actif
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Symbole *</Label>
                            <Input
                                id="symbol"
                                value={newSymbol}
                                onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                                placeholder="ex: EURUSD, BTCUSDT, AAPL"
                                className="uppercase"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Nom (optionnel)</Label>
                            <Input
                                id="name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="ex: Euro / US Dollar"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type d'actif</Label>
                            <Select value={newType} onValueChange={(v) => setNewType(v as Asset["asset_type"])}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSET_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCreateDialogOpen(false);
                                resetNewAssetForm();
                            }}
                            disabled={creating}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleCreateAsset}
                            disabled={!newSymbol.trim() || creating}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                            {creating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création...
                                </>
                            ) : (
                                "Créer l'actif"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
