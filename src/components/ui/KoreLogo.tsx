// ============================================================================
// KORE LOGO - Composant Logo Réutilisable
// ============================================================================

import { cn } from "@/lib/utils";

interface KoreLogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

// Icon only (for nav, favicon)
export function KoreIcon({ className, size = "md" }: Omit<KoreLogoProps, "showText">) {
    const sizes = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className={cn(sizes[size], className)}
        >
            <defs>
                <linearGradient id="kore-gradient-icon" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0062ff" stopOpacity="1" />
                    <stop offset="100%" stopColor="#61efff" stopOpacity="1" />
                </linearGradient>
            </defs>
            <g transform="translate(20, 20) scale(0.9)">
                <rect x="0" y="0" width="40" height="180" rx="8" fill="url(#kore-gradient-icon)" />
                <path
                    d="M 60 90 L 130 20 L 170 20 L 170 60 L 100 130 L 170 200 L 130 200 L 60 130 Z"
                    fill="url(#kore-gradient-icon)"
                />
            </g>
        </svg>
    );
}

// Full logo with text
export function KoreLogo({ className, size = "md", showText = true }: KoreLogoProps) {
    const sizes = {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
    };

    if (!showText) {
        return <KoreIcon className={className} size={size} />;
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <KoreIcon size={size} />
            <span
                className={cn(
                    "font-black tracking-wider bg-gradient-to-r from-[#0062ff] to-[#61efff] bg-clip-text text-transparent",
                    size === "sm" && "text-lg",
                    size === "md" && "text-xl",
                    size === "lg" && "text-2xl"
                )}
            >
                KORE
            </span>
        </div>
    );
}

// Export default for simple usage
export default KoreLogo;
