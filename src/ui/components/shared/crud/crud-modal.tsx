"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/ui/components/ui/dialog";
import { ScrollArea } from "@/src/ui/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title: string;
  className?: string; //controlar a largura (size) de fora se precisar
};

export function CrudModal({ 
  open, 
  onOpenChange, 
  children, 
  title, 
  className 
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        aria-describedby="Criar ou editar items"
        className={cn(
          "max-h-[97%] w-[95%] md:w-auto max-w-[95vw] sm:max-w-150 p-0 overflow-auto flex flex-col gap-0", 
          className
        )}
      >
        {/* Cabeçalho Refinado */}
        <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b bg-muted/5">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Área de Conteúdo com Scroll Inteligente */}
        {/* max-h-[80vh] garante que a modal nunca fique maior que a tela do usuário */}
        <ScrollArea className="flex-1 max-h-[85vh] md:max-h-[75vh]">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}