"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/components/ui/select";
import { Label } from "@/src/ui/components/ui/label";
import { cn } from "@/lib/utils";

type SelectOption<T> = {
  value: string;
  label: string;
  data?: T;
};

type GenericSelectProps<T> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: string;
  onChange: (value: string, option?: SelectOption<T>) => void;
  className?: string;
  error?: string; // Adicionei suporte a erro visual
};

export function GenericSelect<T>({
  label,
  placeholder = "Selecione...",
  options,
  value,
  onChange,
  className,
  error,
}: GenericSelectProps<T>) {
  const handleChange = (val: string) => {
    const selected = options.find((opt) => opt.value === val);
    onChange(val, selected);
  };

  return (
    <div className="flex flex-col gap-2 w-full min-w-0">
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
          {label}
        </Label>
      )}
      
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger
          className={cn(
            "w-full bg-background transition-all focus:ring-2 focus:ring-primary/20",
            error && "border-destructive focus:ring-destructive/20",
            className
          )}
        >
          <SelectValue placeholder={placeholder} className="truncate" />
        </SelectTrigger>

        <SelectContent className="max-h-64">
          {options.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map((opt) => (
              <SelectItem 
                key={opt.value} 
                value={opt.value}
                className="cursor-pointer "
              >
                {opt.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {error && (
        <span className="text-[10px] font-medium text-destructive ml-1">
          {error}
        </span>
      )}
    </div>
  );
}