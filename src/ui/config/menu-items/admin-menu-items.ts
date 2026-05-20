import { DraftingCompass } from "lucide-react"

import { 
  LayoutDashboard, 
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
      { title: "Dashboard", url: "/", icon: LayoutDashboard },   
      {
        title: "Movimentações",
        icon: ArrowLeftRight,
        isActive: true,
        subItems: [
          { title: "Entrada", url: "/inbound" },
          { title: "Trasnferência", url: "/transfer" },
          { title: "Saida", url: "/outbound" },
          { title: "Histórico", url: "/stock-moviment" },
        ],
        
      },
    ],
  },
  {
    title: "Cadastros Gerais",
    items: [
      {
        title: "Estoque",
        icon: Boxes,
        isActive: true,
        subItems: [
          { title: "Estoques", url: "/stock" },
          { title: "Produtos no Estoque", url: "/product-stock" },
        ],
        
      },
      { title: "Produtos", url: "/product", icon: Package },
      { title: "Lojas", url: "/store", icon: Component },
      { title: "Modelos", url: "/model", icon: Layers },
      { title: "Materiais", url: "/material", icon: DraftingCompass },
      { title: "Cores", url: "/color", icon: Palette },
      { title: "Usuários", url: "/user", icon: Users },
    ]
  }
]