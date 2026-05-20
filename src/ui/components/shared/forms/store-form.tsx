"use client";

import { Store } from "@/src/ui/types/store";
import { StoreService } from "@/src/ui/services/store.service";
import { feedback } from "@/src/ui/lib/feedback";
import { Separator } from "@/src/ui/components/ui/separator";
import { Label } from "@/src/ui/components/ui/label";
import { Input } from "@/src/ui/components/ui/input";
import { ConfirmModal } from "../modals/confirm-modal";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { useStoreForm } from "@/src/app/(dashboard)/store/hooks/use-store-form";

type Props = {
    onSuccess: (store: Store) => void;
    initialData?: Store;
};

export function StoreForm({ onSuccess, initialData }: Props) {
    const {
        name,

        setName,
    } = useStoreForm(initialData);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        feedback.loading("Processando entrada...");
        try {
            const storeService = new StoreService("/store");
            const store = initialData ? await handleUpdate(storeService) : await handleCreate(storeService);
            feedback.dismiss(); // Remove o loading
            feedback.success(initialData ? 'Atualização realizada com sucesso!' : 'Registro realizado com sucesso!');
            onSuccess(store); // atualiza tabela
        } catch (error) {
            feedback.dismiss();
            feedback.error(error); // O utilitário já trata a mensagem de erro da API
        }
    };

    const handleCreate = async (storeService: StoreService) => {
        return await storeService.create({ name });
    }

    const handleUpdate = async (storeService: StoreService) => {
        if (initialData) return await storeService.update(initialData.id, { name });
    }

    return (
        <form id="store-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Principal */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label
                        htmlFor="store-name"
                        className="text-xs font-bold uppercase tracking-wider"
                    >
                        Nome da Loja
                    </Label>
                    <Input
                        id="store-name"
                        type="text"
                        placeholder="Ex: Loja Matriz Centro"
                        // Mantendo o padrão de Capitalize que usamos no estoque
                        value={name ? name[0].toUpperCase() + name.slice(1) : ""}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {/* Ação Final com o ConfirmModal para manter a segurança */}
            <div className="flex justify-end pt-4">
                <ConfirmModal
                    title={initialData ? "Confirmar atualização?" : "Confirmar registro?"}
                    description="Esta ação salvará as alterações dos dados da loja."
                    confirmText="Sim, salvar"
                    formId="store-form"
                >
                    <Button
                        type="button"
                        className="w-full md:w-auto px-8 gap-2 bg-primary hover:bg-primary/90"
                    >
                        <Save className="h-4 w-4" />
                        Salvar Loja
                    </Button>
                </ConfirmModal>
            </div>
        </form>
    );
}