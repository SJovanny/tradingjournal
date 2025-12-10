// ============================================================================
// DASHBOARD LAYOUT - Layout Principal avec Sidebar et Header
// ============================================================================

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar - Desktop */}
            <Sidebar user={user} />

            {/* Main content area */}
            <div className="lg:pl-20 xl:pl-64">
                {/* Header */}
                <Header user={user} />

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
