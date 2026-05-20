"use client"

import { ReactNode, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/ui/components/ui/dialog"

import { Button } from "@/src/ui/components/ui/button"
import { Filter } from "lucide-react"

type Props = {
  title?: string
  children: ReactNode
  onOpen: (open: boolean) => void
  open: boolean
}

export function FilterModal({
  title = "Filtros",
  children,
  onOpen,
  open,
}: Props) {
  // const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}