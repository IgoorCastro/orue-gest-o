'use client'

import AdminDashboard from "@/src/ui/components/shared/dashboard/admin-dashboard";
import ManagerDashboard from "@/src/ui/components/shared/dashboard/manager-dashboard";
import OperatorDashboard from "@/src/ui/components/shared/dashboard/operator-dashboard";
import UserHeader from "@/src/ui/components/shared/ui/header";
import { useUser } from "@/src/ui/contexts/user-context";

export default function DashboardPage() {
    const user = useUser();

    return (
        <>
            <div className="p-8">
                <UserHeader title="Bem-vindo de volta!" description="Acompanhe as operações e movimentações do sistema." />
            </div>

            {user?.role === "ADMIN" && <AdminDashboard />}
            {user?.role === "MANAGER" && <ManagerDashboard />}
            {user?.role === "OPERATOR" && <OperatorDashboard />}
        </>
    );
}
