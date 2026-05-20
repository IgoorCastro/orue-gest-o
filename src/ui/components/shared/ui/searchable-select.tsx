"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Circle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/src/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/ui/components/ui/popover";
import { Label } from "@/src/ui/components/ui/label";

export function ProductSearchSelect({
  options,
  value,
  onSelectedChange,
  onInputChange,
  label,
  loadingFetch = false,
  placeholder = "Buscar produto..."
}: any) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background font-normal"
          >
            {value
              ? options.find((opt: any) => opt.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Digite o nome do produto..."
              onChangeCapture={(e) => {
                onInputChange(e.target.value);
              }}
            />
            {!loadingFetch
              ? (options.map((opt: any) => (
                <CommandList key={opt.value}>
                  <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      key={opt.value}
                      value={opt.label} // O Command filtra baseado no value/label interno
                      onSelect={() => {
                        onSelectedChange(opt.value, opt);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === opt.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              )))
              : (
                <div className="flex justify-center py-5">
                  <Circle />
                </div>
              )
            }
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}