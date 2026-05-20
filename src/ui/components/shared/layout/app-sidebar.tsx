'use client'

import { useUser } from "@/src/ui/contexts/user-context"
import DefaultLoading from "../ui/loading-default"
import { AdminSidebar } from "../sidebar/sidebar-admin"
import { ManagerSidebar } from "../sidebar/sidebar-manager"
import { OperatorSidebar } from "../sidebar/sidebar-operator"

export function AppSidebar() {
  const user = useUser();

  if(!user) return <DefaultLoading />

  if(user.role === "ADMIN") return <AdminSidebar />
  if(user.role === "MANAGER") return <ManagerSidebar />
  if(user.role === "OPERATOR") return <OperatorSidebar />
}