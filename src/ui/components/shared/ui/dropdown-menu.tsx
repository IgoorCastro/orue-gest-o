import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/src/ui/components/ui/dropdown-menu"
import { ChevronDown, Check, XCircle } from "lucide-react"
import { cn } from "@/lib/utils" // Utilitário padrão do shadcn

type DropdownItem = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  items: DropdownItem[];
  value?: string; // Adicionado para saber o que está selecionado
  onChange: (value: string) => void;
  className?: string;
}

export function Dropdown({ onChange, title, items, value, className }: Props) {
  // Verifica se existe algum filtro ativo
  const hasFilter = value && value !== "";

  return (
    <div className={cn("flex items-center gap-2 px-2 w-min", className)}>
      <span className="text-lg font-bold">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "flex items-center justify-center rounded-md transition-colors outline-none",
              "hover:bg-muted border border-transparent dark:bg-gray-600 dark:hover:bg-gray-500",
              hasFilter ? "text-primary border-green-500 dark:bg-gray-800" : "text-muted-foreground"
            )}
          >
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-200",
              "group-data-[state=open]:rotate-180" // Gira o ícone ao abrir (opcional)
            )} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="max-w-56 mt-1">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Filtrar por {title}
          </DropdownMenuLabel>
          
          <DropdownMenuItem
            onClick={() => onChange("")}
            className="flex items-center justify-between cursor-pointer text-destructive focus:text-destructive"
          >
            <span className="font-medium">Limpar filtro</span>
            <XCircle className="w-3.5 h-3.5 opacity-70" />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="max-h-75 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => onChange(item.value)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className={cn(
                    "truncate",
                    value === item.value && "font-semibold text-primary"
                  )}>
                    {item.label}
                  </span>
                  
                  {value === item.value && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-2 text-xs text-center text-muted-foreground">
                Nenhum item encontrado
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}