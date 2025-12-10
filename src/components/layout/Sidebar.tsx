"use client";

// ============================================================================
// SIDEBAR - Navigation Desktop
// ============================================================================

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
    User,
} from "lucide-react";
import { KoreIcon } from "@/components/ui/KoreLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/app/actions/auth";

// Types
interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

interface SidebarProps {
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
];

const bottomNavItems: NavItem[] = [
    { label: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    const userInitials = user?.user_metadata?.full_name
        ? user.user_metadata.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : user?.email?.[0].toUpperCase() || "U";

    return (
        <TooltipProvider delayDuration={0}>
            <aside className="hidden lg:flex flex-col h-screen w-20 xl:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed left-0 top-0 z-40">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center xl:justify-start xl:px-6 border-b border-slate-200 dark:border-slate-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <KoreIcon size="lg" />
                        <span className="hidden xl:block font-black text-xl tracking-wider bg-gradient-to-r from-[#0062ff] to-[#61efff] bg-clip-text text-transparent">
                            KORE
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 xl:px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                                            isActive
                                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                                                : "text-slate-600 dark:text-slate-400"
                                        )}
                                    >
                                        <Icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-blue-600 dark:text-blue-400")} />
                                        <span className="hidden xl:block">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="xl:hidden">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="py-4 px-3 xl:px-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                            "hover:bg-slate-100 dark:hover:bg-slate-800",
                                            isActive
                                                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                                                : "text-slate-600 dark:text-slate-400"
                                        )}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="hidden xl:block">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="xl:hidden">
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}

                    {/* User Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden xl:block text-left flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 dark:text-white truncate">
                                        {user?.user_metadata?.full_name || "Utilisateur"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Profil
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings" className="flex items-center gap-2">
                                    <Settings className="w-4 h-4" />
                                    Paramètres
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => logout()}
                                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Déconnexion
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>
        </TooltipProvider>
    );
}
