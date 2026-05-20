"use client";

import { Color } from "@/src/ui/types/color";
import { ColorService } from "@/src/ui/services/color.service";
import { Separator } from "@/src/ui/components/ui/separator";
import { Label } from "@/src/ui/components/ui/label";
import { Input } from "@/src/ui/components/ui/input";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { feedback } from "@/src/ui/lib/feedback";
import { ConfirmModal } from "../modals/confirm-modal";
import { useColorForm } from "@/src/app/(dashboard)/color/hooks/use-color-form";
import { useMemo } from "react";

type Props = {
  onSuccess: (color: Color) => void;
  initialData?: Color;
};

export function ColorForm({ onSuccess, initialData }: Props) {
  const { name, setName } = useColorForm(initialData);

  const colorService = useMemo(() => new ColorService("/color"), []);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!lengthValidation()) return;
    
    feedback.loading("Processando entrada cor...");

    try {
      const color = initialData ? await updateModel(colorService) : await createModel(colorService);
      // Sucesso!
      feedback.dismiss(); // Remove o loading
      feedback.success(`Entrada de cor realizada com sucesso!`);
      onSuccess(color); // atualiza tabela // n precisa mais
    } catch (error) {
      feedback.dismiss();
      feedback.error(error); // O utilitário já trata a mensagem de erro da API
    }
  };

  // valida o tamanho da entrada de nome
  const lengthValidation = (): boolean => {
    if (name.trim().length < 3) {
      feedback.error("Nome deve ter no mínimo 3 caracteres.");
      return false;
    }

    return true;
  };

  const createModel = async (service: ColorService) => {
    return await service.create({ name });
  }

  const updateModel = async (service: ColorService) => {
    if (initialData) {
      return await service.update(
        initialData.id,
        { name }
      )
    }
  }

  return (
    <form id="color-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Seção Principal */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-wider"
          >
            Nome da Cor
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Azul Royal"
            className={name.length > 0 && name.length < 3 ? "focus-visible:border-destructive focus-visible:ring-1 " : ""}
            // Padronização: Primeira letra sempre maiúscula visualmente
            value={name ? name[0].toUpperCase() + name.slice(1) : ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* Ação Final com Confirmação */}
      <div className="flex justify-end pt-4">
        <ConfirmModal
          title={initialData ? "Confirmar atualização?" : "Confirmar registro?"}
          description="Esta ação salvará as alterações nos dados da cor."
          confirmText="Sim, salvar"
          formId="color-form" // Vinculado ao ID do form acima
        >
          <Button
            type="button"
            className="w-full md:w-auto px-8 gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {initialData ? "Atualizar Cor" : "Salvar Cor"}
          </Button>
        </ConfirmModal>
      </div>
    </form>
  );
}