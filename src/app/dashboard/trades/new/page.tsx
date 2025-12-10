// ============================================================================
// NEW TRADE PAGE - Page d'Ajout de Trade
// ============================================================================

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AddTradeForm } from "@/components/trades/AddTradeForm";

export const metadata = {
    title: "Nouveau Trade",
    description: "Enregistrez un nouveau trade",
};

export default async function NewTradePage() {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user's portfolios
    const { data: portfolios } = await supabase
        .from("portfolios")
        .select("id, name, portfolio_type")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

    // Fetch user's strategies
    const { data: strategies } = await supabase
        .from("strategies")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name");

    // If no portfolios, redirect to settings to create one
    if (!portfolios || portfolios.length === 0) {
        redirect("/dashboard/settings?setup=portfolio");
    }

    return (
        <div className="max-w-4xl mx-auto">
            <AddTradeForm
                portfolios={portfolios || []}
                strategies={strategies || []}
                onSuccess={(tradeId) => {
                    // Will redirect via server action
                }}
            />
        </div>
    );
}
