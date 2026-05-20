"use client";

import { Separator } from "@/src/ui/components/ui/separator";
import { useUser } from "@/src/ui/contexts/user-context";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import OutboundAdminPage from "@/src/ui/components/shared/outbound/outbound-admin";
import OutbounManagerPage from "@/src/ui/components/shared/outbound/outbound-manager";
import UserHeader from "@/src/ui/components/shared/ui/header";

export default function OutboundPage() {
  const user = useUser();

  !user && <DefaultLoading />

  return (
    <div className="flex flex-col gap-6 p-8">
      <UserHeader title="Outbound Stock" description="Gerenciamento de saida de mercadorias e fluxo de estoque." />

      <Separator className="opacity-50" />

      <main className="space-y-6">
        {/* Manager/Admin Shared View */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              Fluxo de Saida
            </h2>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            {user?.role === "ADMIN" && <OutboundAdminPage />}
            {user?.role === "MANAGER" && <OutbounManagerPage />}
          </div>
        </section>
      </main>
    </div>
  );
}