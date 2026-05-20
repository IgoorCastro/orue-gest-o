'use client'

import { useUser } from "@/src/ui/contexts/user-context"
import DefaultLoading from "../ui/loading-default"
import { RootSidebar } from "./sidebar"
import { menuAdminItems } from "@/src/ui/config/menu-items/admin-menu-items";

export function AdminSidebar() {
  const user = useUser();

  if (!user) return <DefaultLoading />

  return <RootSidebar items={menuAdminItems} />
}