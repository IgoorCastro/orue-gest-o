// Botões para editar e desativar itens
import { Button } from "@/src/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/ui/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "../modals/confirm-modal";

import { Edit, Trash2, RotateCcw } from "lucide-react";

type ActionButtonsProps = {
  onSucces: () => void;   // executa quando uma ação é bem sucedida
  onEdit?: () => void;    // função para update
  onDelete?: () => void;  // função para desativar
  onRestore?: () => void; // Nova prop para reativar
  isDeleted?: boolean;    // Para saber qual estado renderizar
  disabled?: boolean;
  className?: string;
};

export function ActionButtons({
  onSucces,
  onEdit,
  onDelete,
  onRestore,
  isDeleted,
  disabled,
  className
}: ActionButtonsProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn("flex flex-col xl:flex-row items-center justify-center gap-3", className)}>
        
        {/* EDITAR: Só mostra se não estiver deletado (opcional) */}
        {!isDeleted && onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                disabled={disabled}
                className="h-7 w-7 rounded-full border-primary/20 hover:bg-primary/10 hover:text-primary transition-all"
                onClick={(e) => { 
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar item</TooltipContent>
          </Tooltip>
        )}

        {/* REATIVAR OU EXCLUIR */}
        {isDeleted && onRestore ? (
          // Botão de Restaurar (Caso esteja deletado)
          <Tooltip>
            <ConfirmModal
              title="Deseja reativar este item?"
              description="Ele voltará a aparecer nas listagens comuns."
              confirmText="Reativar"
              onConfirm={() => {
                onRestore();
                onSucces();
              }}
            >
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={disabled}
                  className="h-7 w-7 rounded-full border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-500 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </ConfirmModal>
            <TooltipContent>Reativar item</TooltipContent>
          </Tooltip>
        ) : (
          // Botão de Deletar (Caso esteja ativo)
          onDelete && (
            <Tooltip>
              <ConfirmModal
                title="Deseja desativar este item?"
                description="Esta ação pode ser revertida posteriormente."
                confirmText="Desativar"
                variant="destructive"
                onConfirm={() => {
                  onDelete();
                  onSucces();
                }}
              >
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={disabled}
                    className="h-7 w-7 rounded-full border-destructive/20 hover:bg-destructive/10 hover:text-destructive transition-all"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </ConfirmModal>
              <TooltipContent>Desativar item</TooltipContent>
            </Tooltip>
          )
        )}
      </div>
    </TooltipProvider>
  );
}