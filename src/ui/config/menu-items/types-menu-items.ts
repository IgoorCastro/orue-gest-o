import { LucideIcon } from "lucide-react"

interface NavSubItem {
    title: string
    url: string
}

interface NavItem {
    title: string
    url?: string // Opcional porque itens com sub-itens podem não ter link próprio
    icon?: LucideIcon
    isActive?: boolean
    subItems?: NavSubItem[] // Opcional
}

export interface MenuGroup {
    title: string
    items: NavItem[]
}