"use client";

// ============================================================================
// BURGER MENU - Navigation Mobile
// ============================================================================

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    LineChart,
    BookOpen,
    Brain,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { KoreIcon } from "@/components/ui/KoreLogo";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { logout } from "@/app/actions/auth";

// Types
interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface BurgerMenuProps {
    user?: {
        email?: string;
        user_metadata?: {
            full_name?: string;
            avatar_url?: string;
        };
    } | null;
}

// Navigation items
const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Trades", href: "/dashboard/trades", icon: LineChart },
    { label: "Stratégies", href: "/dashboard/strategies", icon: BookOpen },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Psychologie", href: "/dashboard/psychology", icon: Brain },
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function BurgerMenu({ user }: BurgerMenuProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const userInitials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : user?.email?.[0].toUpperCase() || "U";

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Menu"
                >
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <SheetTitle className="flex items-center gap-3">
                        <KoreIcon size="lg" />
                        <span className="font-black text-xl tracking-wider bg-gradient-to-r from-[#0062ff] to-[#61efff] bg-clip-text text-transparent">
                            KORE
                        </span>
                    </SheetTitle>
                </SheetHeader>

                {/* User Profile */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={user?.user_metadata?.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {user?.user_metadata?.full_name || "Utilisateur"}
                            </p>
                            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200",
                                    "hover:bg-slate-100 dark:hover:bg-slate-800",
                                    isActive
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400"
                                )}
                            >
                                <Icon className={cn("w-5 h-5", isActive && "text-blue-600 dark:text-blue-400")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                        className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl text-base font-medium transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
