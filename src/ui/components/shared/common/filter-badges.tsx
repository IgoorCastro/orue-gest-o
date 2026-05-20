import { X } from "lucide-react";
import { Badge } from "@/src/ui/components/ui/badge";

export type DependencyItem = { id: string; name: string };

// T representa o objeto de filtros (ex: ProductFiltersDto)
type FilterBadgesProps<T> = {
  filters: T;
  onRemove: (key: keyof T, value?: any) => void;
  onClearAll: () => void;
  // Mapeamento opcional para transformar IDs em nomes legíveis
  dependencies?: Partial<Record<keyof T, DependencyItem[]>>;
  // Mapeamento opcional para labels customizados e funções de formatação
  configs: {
    [K in keyof T]?: {
      label: string;
      render?: (value: any) => string;
      isSeparator?: boolean; // Para casos de range como preço
      dependencyKey?: string;
    };
  };
};

export function FilterBadges<T extends Record<string, any>>({
  filters,
  onRemove,
  onClearAll,
  dependencies,
  configs,
}: FilterBadgesProps<T>) {
  const badges: React.ReactNode[] = [];

  // Percorre as chaves do objeto de filtros que possuem configuração
  Object.keys(configs).forEach((key) => {
    const filterKey = key as keyof T;
    const value = filters[filterKey];
    const config = configs[filterKey];

    if (!value || (Array.isArray(value) && value.length === 0)) return;

    // Caso 1: Array (Cores, Materiais, etc)
    if (Array.isArray(value)) {
      value.forEach((id: any) => {
        const depList = dependencies?.[filterKey] || [];
        const name = depList.find((d) => d.id === id)?.name || id;

        badges.push(
          <BadgeItem
            key={`${key}-${id}`}
            label={`${config?.label}: ${name}`}
            onRemove={() => onRemove(filterKey, id)}
          />
        );
      });
    }
    // Caso 2: Valor Simples (String, Number, Enum)
    else {
      const displayValue =
        config?.render
          ? config.render(value)
          : value; // busca pelo nome
      badges.push(
        <BadgeItem
          key={key}
          label={`${config?.label}: ${displayValue}`}
          onRemove={() => onRemove(filterKey)}
        />
      );
    }
  });

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-1">
      <span className="text-[10px] font-bold uppercase text-muted-foreground mr-1">
        Filtros:
      </span>
      {badges}
      <button
        onClick={onClearAll}
        className="text-[11px] text-muted-foreground hover:text-destructive transition-colors underline-offset-4 hover:underline ml-2"
      >
        Limpar tudo
      </button>
    </div>
  );
}

// Sub-componente interno para manter o DRY
function BadgeItem({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 px-2 py-1 bg-primary/10 text-primary border-primary/20">
      {label}
      <X
        className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors"
        onClick={onRemove}
      />
    </Badge>
  );
}