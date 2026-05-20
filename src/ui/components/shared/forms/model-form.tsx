"use client";

import { Model } from "@/src/ui/types/model";
import { ModelService } from "@/src/ui/services/model.service";
import { Separator } from "@/src/ui/components/ui/separator";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { Label } from "@/src/ui/components/ui/label";
import { Input } from "@/src/ui/components/ui/input";
import { feedback } from "@/src/ui/lib/feedback";
import { ConfirmModal } from "../modals/confirm-modal";
import { useModelForm } from "@/src/app/(dashboard)/model/hooks/use-model-form";

type Props = {
    onSuccess: (model: Model) => void;
    initialData?: Model;
};

export function ModelForm({ onSuccess, initialData }: Props) {
    const { name, setName } = useModelForm(initialData);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        feedback.loading("Processando entrada modelo...");
        try {
            const modelService = new ModelService("/model");
            const model = initialData ? await updateModel(modelService) : await createModel(modelService);
            feedback.dismiss(); // Remove o loading
            feedback.success(`Entrada de modelo realizada com sucesso!`);
            onSuccess(model); // atualiza tabela
        } catch (error) {
            feedback.dismiss();
            feedback.error(error); // O utilitário já trata a mensagem de erro da API
        }
    };

    const createModel = async (service: ModelService) => {
        return await service.create({ name });
    }

    const updateModel = async (service: ModelService) => {
        if (initialData) {
            return await service.update(
                initialData.id,
                { name }
            )
        }
    }

    return (
        <form id="model-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Principal */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-xs font-bold uppercase tracking-wider"
                    >
                        Nome do Modelo
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Ex: Camiseta Oversized Cotton"
                        // Mantendo o padrão visual de primeira letra maiúscula
                        value={name ? name[0].toUpperCase() + name.slice(1) : ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {/* Ação Final com Modal de Confirmação */}
            <div className="flex justify-end pt-4">
                <ConfirmModal
                    title={initialData ? "Confirmar atualização?" : "Confirmar registro?"}
                    description="Esta ação salvará as alterações nos dados do modelo."
                    confirmText="Sim, salvar"
                    formId="model-form" // Vincula o botão do modal ao formulário
                >
                    <Button
                        type="button" // Type button pois o ConfirmModal lidará com o submit
                        className="w-full md:w-auto px-8 gap-2 bg-primary hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" />
                        Salvar Modelo
                    </Button>
                </ConfirmModal>
            </div>
        </form>
    );
}