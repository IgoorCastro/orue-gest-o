'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarTrigger,
} from "@/src/ui/components/ui/sidebar"

import {
    LayoutDashboard,
    ChevronRight,
    ListIndentIncrease
} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/src/ui/components/ui/collapsible"

import Link from "next/link"
import { ModeToggle } from "../actions/mode-toggle"
import { Label } from "@/src/ui/components/ui/label"
import SettingsDialog from "../modals/settings-dialog"
import { useSidebar } from "@/src/ui/components/ui/sidebar"
import { useUser } from "@/src/ui/contexts/user-context"
import DefaultLoading from "../ui/loading-default"
import { MenuGroup } from "@/src/ui/config/menu-items/types-menu-items"

type SidebarProps = {
    items: MenuGroup[]
}

export function RootSidebar({ items }: SidebarProps) {
    const { state, isMobile, toggleSidebar } = useSidebar()
    const user = useUser();
    const isCollapsed = state === "collapsed"

    if (!user) return <DefaultLoading />

    return (
        <div className="">
            {/* trigger para mobiles */}
            <div className="w-min h-min ml-2 my-2">
                {isMobile && <SidebarTrigger icon={ListIndentIncrease} />}
            </div>
            <Sidebar
                variant="sidebar"
                collapsible="icon"
                className="transition-all duration-300"
            >
                <SidebarHeader className="flex flex-row items-center justify-between py-3 border-b">

                    {!isCollapsed && (
                        <div className="flex items-center gap-2 px-2">
                            <LayoutDashboard />
                        </div>
                    )}

                    <SidebarTrigger className={isCollapsed ? "p-3" : "p-4"} />
                </SidebarHeader>

                <SidebarContent>
                    {items.map((group) => (
                        <SidebarGroup key={group.title}>

                            {!isCollapsed && (
                                <SidebarGroupLabel>
                                    {group.title}
                                </SidebarGroupLabel>
                            )}

                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>

                                        {item.subItems ? (
                                            <Collapsible className="group/collapsible">

                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        className={`
                                transition-all duration-200
                                ${isCollapsed ? "justify-center" : ""}
                                hover:bg-accent
                              `}
                                                    >
                                                        {item.icon && <item.icon />}

                                                        {!isCollapsed && (
                                                            <>
                                                                <span>{item.title}</span>
                                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                            </>
                                                        )}
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent>
                                                    <SidebarMenuSub>
                                                        {item.subItems.map((sub) => (
                                                            <SidebarMenuSubItem key={sub.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link href={sub.url} onClick={() => isMobile && toggleSidebar()}>
                                                                        <span>{sub.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>

                                            </Collapsible>
                                        ) : (
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={item.title}
                                                className={`
                                                    transition-all duration-200
                                                    ${isCollapsed ? "justify-center" : ""}
                                                    hover:bg-accent
                                                `}
                                            >
                                                <Link href={item.url ?? "#"} onClick={() => isMobile && toggleSidebar()}>
                                                    {item.icon && <item.icon />}
                                                    {!isCollapsed && <span>{item.title}</span>}
                                                </Link>
                                            </SidebarMenuButton>
                                        )}

                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>

                        </SidebarGroup>
                    ))}
                </SidebarContent>

                <SidebarFooter className="flex flex-row items-center justify-between p-3 border-t">
                    {!isCollapsed && (
                        <Label className="text-sm">
                            Olá, {user?.name}
                        </Label>
                    )}

                    <div className="flex items-center gap-3">
                        {!isCollapsed && <ModeToggle />}
                        <SettingsDialog />
                    </div>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}