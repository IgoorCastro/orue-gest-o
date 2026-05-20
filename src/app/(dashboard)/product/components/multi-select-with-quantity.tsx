"use client";

import { useState } from "react";
import { Plus, X, Hash } from "lucide-react";
import { Button } from "@/src/ui/components/ui/button";
import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/src/ui/components/ui/select";
import { Badge } from "@/src/ui/components/ui/badge";

// Estendemos o tipo para garantir que o objeto selecionado tenha 'quantity'
type SelectedItem<T> = T & { quantity: number };

type Props<T> = {
  label: string;
  items: T[];
  selected: SelectedItem<T>[];
  setSelected: (items: SelectedItem<T>[]) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
};

export function MultiSelectWithQuantity<T>({ 
  label, 
  items, 
  selected, 
  setSelected, 
  getId, 
  getLabel 
}: Props<T>) {
  // Estados para o item que está sendo "preparado" para adição
  const [currentId, setCurrentId] = useState<string>("");
  const [currentQty, setCurrentQty] = useState<number>(1);

  const handleAdd = () => {
    if (!currentId || currentQty <= 0) return;

    const item = items.find((i) => getId(i) === currentId);
    if (!item) return;

    // Se o item já existe, apenas somamos a quantidade
    const existingIndex = selected.findIndex((i) => getId(i) === currentId);

    if (existingIndex > -1) {
      const newSelected = [...selected];
      newSelected[existingIndex].quantity += currentQty;
      setSelected(newSelected);
    } else {
      setSelected([...selected, { ...item, quantity: currentQty }]);
    }

    // Limpa os campos para a próxima adição
    setCurrentId("");
    setCurrentQty(1);
  };

  const remove = (id: string) => {
    setSelected(selected.filter((i) => getId(i) !== id));
  };

  return (
    <div className="w-full space-y-3 p-4 border rounded-lg bg-muted/10">
      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      {/* Controles de Adição */}
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <span className="text-[10px] text-muted-foreground ml-1">Produto</span>
          <Select value={currentId} onValueChange={setCurrentId}>
            <SelectTrigger className="bg-background w-full">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={getId(item)} value={getId(item)}>
                  {getLabel(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-24 space-y-1">
          <span className="text-[10px] text-muted-foreground ml-1">Qtd</span>
          <Input
            type="number"
            min={1}
            value={currentQty}
            onChange={(e) => setCurrentQty(Number(e.target.value))}
            className="bg-background"
          />
        </div>

        <Button 
          type="button" 
          size="icon" 
          onClick={handleAdd}
          disabled={!currentId}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Lista de Selecionados */}
      <div className="flex flex-wrap gap-2 pt-2">
        {selected.length === 0 && (
          <p className="text-xs text-muted-foreground italic">Nenhum item adicionado.</p>
        )}
        {selected.map((item) => (
          <Badge
            key={getId(item)}
            variant="secondary"
            className="pl-2 pr-1 py-1 flex items-center gap-2 border shadow-sm"
          >
            <span className="font-bold text-primary flex items-center gap-0.5">
              {item.quantity} <X className="h-3 w-3" />
            </span>
            <span className="text-xs">{getLabel(item)}</span>
            <button
              type="button"
              onClick={() => remove(getId(item))}
              className="ml-1 p-0.5 hover:bg-destructive hover:text-destructive-foreground rounded-full transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}