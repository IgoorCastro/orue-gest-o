import { DraftingCompass, LucideIcon } from "lucide-react"

import { 
  Package, 
  Boxes, 
  ArrowLeftRight, 
  Palette, 
  Component, 
  Layers, 
  Users 
} from "lucide-react"

import { MenuGroup } from "./types-menu-items"

export const menuAdminItems: MenuGroup[] = [
  {
    title: "Dashboard",
    items: [
      
      {
        title: "Movimentações",
        icon: ArrowLeftRight,
        isActive: true,
        subItems: [
          { title: "Entrada", url: "/admin/inbound" },
          { title: "Trasnferência", url: "/admin/transfer" },
          { title: "Saida", url: "/admin/outbound" },
          { title: "Histórico", url: "/admin/stock-moviment" },
        ],
        
      },
    ],
  },
  {
    title: "Cadastros Gerais",
    items: [
      {
        title: "Estoques",
        icon: Boxes,
        isActive: true,
        subItems: [
          { title: "Estoques", url: "/admin/stock" },
          { title: "Produtos no Estoque", url: "/admin/product-stock" },
        ],
        
      },
      { title: "Produtos", url: "/admin/product", icon: Package },
      { title: "Lojas", url: "/admin/store", icon: Component },
      { title: "Modelos", url: "/admin/model", icon: Layers },
      { title: "Materiais", url: "/admin/material", icon: DraftingCompass },
      { title: "Cores", url: "/admin/color", icon: Palette },
      { title: "Usuários", url: "/admin/user", icon: Users },
    ]
  }
]