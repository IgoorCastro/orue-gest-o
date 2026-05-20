"use client";

import { useUser } from "@/src/ui/contexts/user-context";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import UserHeader from "@/src/ui/components/shared/ui/header";
import InboundAdminPage from "@/src/ui/components/shared/inbound/inbound-admin";
import InboundManagerPage from "@/src/ui/components/shared/inbound/inbound-manager";
import { Separator } from "@/src/ui/components/ui/separator";

export default function InboundStockPage() {
    const user = useUser();

    !user && <DefaultLoading />

    return (
        <div className="flex flex-col gap-6 p-8">
            <UserHeader title="Inbound Stock" description="Gerenciamento de entrada de mercadorias e fluxo de estoque." />

            <Separator className="opacity-50" />
            
            <main className="space-y-6">
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Fluxo de Entrada
                        </h2>
                    </div>

                    <div className="rounded-lg border bg-card shadow-sm">
                        {user?.role === "ADMIN" && <InboundAdminPage />}
                        {user?.role === "MANAGER" && <InboundManagerPage />}
                    </div>
                </section>
            </main>
        </div>
    );
}