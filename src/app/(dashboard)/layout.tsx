import type { Metadata } from "next";
import { SidebarProvider } from "@/src/ui/components/ui/sidebar"
import { AppSidebar } from "@/src/ui/components/shared/layout/app-sidebar";
import { TooltipProvider } from "@/src/ui/components/ui/tooltip"
import { cookies } from "next/headers";
import { verifyToken } from "@/src/infrastructure/services/auth";
import { UserProvider } from "@/src/ui/contexts/user-context";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gestão de estoque",
};

type User = {
  id: string;
  role: string;
  name: string;
} | null;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const cookiesHeader = await cookies();
  const token = cookiesHeader.get("auth-token")?.value;

  let user: User = null;

  // Decodifica o token localmente no servidor (evita fetch interno)
  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) user = decoded;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário", error);
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <UserProvider user={user}>
          <div className="max-h-screen flex flex-col md:flex-row min-h-screen w-full border dark:bg-background">
            <AppSidebar />
            <main className="flex-1 min-w-0 h-screen flex flex-col overflow-hidden">
              <div className="w-full h-full p-0 sm:p-1 md:p-6">
                <div className="overflow-auto h-full w-full dark:bg-accent rounded-[calc(0.5rem-1px)] bg-card shadow-[-15px_-15px_30px_rgba(34,197,94,0.06)]">
                  {children}
                </div>
              </div>
            </main>
          </div>
        </UserProvider>
      </SidebarProvider>  
    </TooltipProvider>
  );
}
