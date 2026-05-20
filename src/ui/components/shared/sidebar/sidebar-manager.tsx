'use client'

import { useUser } from "@/src/ui/contexts/user-context";
import DefaultLoading from "../ui/loading-default"
import { RootSidebar } from "./sidebar"
import { menuManagerItems } from "@/src/ui/config/menu-items/manager-menu-items";

export function ManagerSidebar() {
  const user = useUser();

  if(!user) return <DefaultLoading />

  return <RootSidebar items={menuManagerItems} />
}