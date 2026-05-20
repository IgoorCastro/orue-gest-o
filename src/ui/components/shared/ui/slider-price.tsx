"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/src/ui/components/ui/slider"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/src/ui/components/ui/dropdown-menu"
import { ChevronDown, DollarSign } from "lucide-react"
import { Input } from "@/src/ui/components/ui/input"
import { cn } from "@/lib/utils"

type Props = {
  minLimit?: number
  maxLimit?: number
  // Ajustado para bater com seu DTO: { gte?: number; lte?: number }
  value?: { gte?: number; lte?: number } 
  onChange: (values: { min?: number; max?: number }) => void
  title?: string
}

export function PriceRange({ 
  minLimit = 0, 
  maxLimit = 1000, 
  value, 
  onChange, 
  title = "Preço" 
}: Props) {
  // Sincroniza o estado interno com gte/lte do seu DTO
  const [range, setRange] = useState<[number, number]>([
    value?.gte ?? minLimit,
    value?.lte ?? maxLimit
  ])

  useEffect(() => {
    setRange([value?.gte ?? minLimit, value?.lte ?? maxLimit])
  }, [value, minLimit, maxLimit])

  const hasFilter = value?.gte !== undefined || value?.lte !== undefined

  function handleSliderChange(values: number[]) {
    const [newMin, newMax] = values as [number, number]
    setRange([newMin, newMax])
    onChange({ min: newMin, max: newMax })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 p-1.5 rounded-md transition-all outline-none border",
              "hover:bg-muted",
              hasFilter 
                ? "text-primary border-primary/20 bg-primary/5 font-medium" 
                : "text-muted-foreground border-transparent"
            )}
          >
            <ChevronDown className="w-4 h-4" />
            {hasFilter && (
              <span className="text-[11px]">
                R$ {range[0]} - R$ {range[1]}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64 p-4 mt-1">
          <div className="flex items-center justify-between mb-2">
            <DropdownMenuLabel className="p-0 font-medium text-xs text-muted-foreground">
              Faixa de Preço
            </DropdownMenuLabel>
            {hasFilter && (
              <button
                onClick={() => onChange({ min: undefined, max: undefined })}
                className="text-[11px] text-destructive hover:underline"
              >
                Limpar
              </button>
            )}
          </div>

          <DropdownMenuSeparator className="mb-4" />

          <div className="px-2 py-4">
            <Slider
              value={range}
              min={minLimit}
              max={maxLimit}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 w-3 h-3 text-muted-foreground" />
              <Input
                type="number"
                className="pl-6 h-8 text-xs"
                value={range[0]}
                onChange={(e) => handleSliderChange([Number(e.target.value), range[1]])}
              />
            </div>
            <span className="text-muted-foreground text-[10px] uppercase font-bold">até</span>
            <div className="relative flex-1">
              <DollarSign className="absolute left-2 top-2.5 w-3 h-3 text-muted-foreground" />
              <Input
                type="number"
                className="pl-6 h-8 text-xs"
                value={range[1]}
                onChange={(e) => handleSliderChange([range[0], Number(e.target.value)])}
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}