import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/src/ui/components/ui/dropdown-menu"
import { ChevronDown, ListFilter } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterItem = {
  id: string;
  name: string;
}

type Props = {
  title: string
  items: FilterItem[]
  selected: string[]
  onChange: (ids: string[]) => void
  className?: string
}

export function MultiSelectFilter({
  title,
  items,
  selected,
  onChange,
  className,
}: Props) {
  const hasFilter = selected.length > 0;

  function handleToggle(id: string) {
    const isSelected = selected.includes(id);
    if (isSelected) {
      onChange(selected.filter((v) => v !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  function handleClear() {
    onChange([]);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="font-medium text-sm text-muted-foreground">{title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-center p-1 ml-1 rounded-md transition-all outline-none border",
              "hover:bg-muted",
              hasFilter 
                ? "text-primary border-primary/20 bg-primary/5" 
                : "text-muted-foreground border-transparent"
            )}
          >
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                "group-data-[state=open]:rotate-180"
              )}
            />
            {hasFilter && (
              <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {selected.length}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-48 max-w-56 mt-1">
          <DropdownMenuLabel className="flex items-center justify-between font-normal">
            <span className="text-xs text-muted-foreground font-medium">
              Selecionar {title}
            </span>
            {hasFilter && (
              <button
                onClick={handleClear}
                className="text-[11px] text-destructive hover:underline font-medium"
              >
                Limpar tudo
              </button>
            )}
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <div className="max-h-64 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <DropdownMenuCheckboxItem
                  key={item.id}
                  checked={selected.includes(item.id)}
                  onCheckedChange={() => handleToggle(item.id)}
                  className="cursor-pointer"
                >
                  <span className={cn(
                    "text-sm",
                    selected.includes(item.id) && "font-medium text-primary"
                  )}>
                    {item.name}
                  </span>
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="p-4 text-xs text-center text-muted-foreground italic">
                Nenhuma opção disponível
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}