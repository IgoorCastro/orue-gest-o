import { 
  LayoutDashboard, 
  ArrowLeftRight, 
} from "lucide-react"

import { MenuGroup } from "./types-menu-items"

export const menuManagerItems: MenuGroup[] = [
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
  }
]