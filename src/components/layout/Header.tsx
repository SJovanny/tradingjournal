"use client";

// ============================================================================
// HEADER - Barre d'en-tête
// ============================================================================

import { BurgerMenu } from "./BurgerMenu";
import { PortfolioSelector } from "@/components/dashboard/PortfolioSelector";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Plus, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
    title?: string;
    showPortfolioSelector?: boolean;
    user?: {
        email?: string;
        user_metadata?: {
            full_name?: string;
            avatar_url?: string;
        };
    } | null;
}

export function Header({ title = "Dashboard", showPortfolioSelector = true, user }: HeaderProps) {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <TooltipProvider>
            <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
                <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
                    {/* Left section */}
                    <div className="flex items-center gap-4">
                        <BurgerMenu user={user} />
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {title}
                        </h1>
                    </div>

                    {/* Center section - Portfolio Selector */}
                    {showPortfolioSelector && (
                        <div className="hidden md:flex flex-1 justify-center">
                            <PortfolioSelector />
                        </div>
                    )}

                    {/* Right section */}
                    <div className="flex items-center gap-2">
                        {/* Quick add trade button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    asChild
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
                                >
                                    <Link href="/dashboard/trades/new">
                                        <Plus className="w-4 h-4 mr-1" />
                                        <span className="hidden sm:inline">Nouveau Trade</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ajouter un trade</TooltipContent>
                        </Tooltip>

                        {/* Notifications */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Notifications</TooltipContent>
                        </Tooltip>

                        {/* Theme toggle */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleTheme}
                                    className="text-slate-600 dark:text-slate-400"
                                >
                                    {theme === "light" ? (
                                        <Moon className="w-5 h-5" />
                                    ) : (
                                        <Sun className="w-5 h-5" />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {theme === "light" ? "Mode sombre" : "Mode clair"}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </header>
        </TooltipProvider>
    );
}
