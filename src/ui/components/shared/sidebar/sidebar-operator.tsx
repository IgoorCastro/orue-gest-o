'use client'

import { useUser } from "@/src/ui/contexts/user-context"
import DefaultLoading from "../ui/loading-default"
import { menuManagerItems } from "@/src/ui/config/menu-items/manager-menu-items"
import { RootSidebar } from "./sidebar"

export function OperatorSidebar() {
  const user = useUser();

  if(!user) return <DefaultLoading />

  return <RootSidebar items={menuManagerItems} />
}