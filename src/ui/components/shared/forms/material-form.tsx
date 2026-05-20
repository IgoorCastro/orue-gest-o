"use client";

import { Material } from "@/src/ui/types/material";
import { MaterialService } from "@/src/ui/services/material.service";
import { Label } from "@/src/ui/components/ui/label";
import { Input } from "@/src/ui/components/ui/input";
import { Separator } from "@/src/ui/components/ui/separator";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { feedback } from "@/src/ui/lib/feedback";
import { useMaterialForm } from "@/src/app/(dashboard)/material/hooks/use-material-form";

type Props = {
    onSuccess: (material: Material) => void;
    initialData?: Material;
};

export function MaterialForm({ onSuccess, initialData }: Props) {
    const { name, setName } = useMaterialForm(initialData);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        feedback.loading("Processando entrada material...");
        try {
            const materialService = new MaterialService("/material");
            const material = initialData ? await updateModel(materialService) : await createModel(materialService);
            feedback.dismiss(); // Remove o loading
            feedback.success(`Entrada de material realizada com sucesso!`);
            onSuccess(material); // atualiza tabela
        } catch (error) {
            feedback.dismiss();
            feedback.error(error); // O utilitário já trata a mensagem de erro da API
        }
    };

    const createModel = async (service: MaterialService) => {
        return await service.create({ name });
    }

    const updateModel = async (service: MaterialService) => {
        if (initialData) {
            return await service.update(
                initialData.id,
                { name }
            )
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção Principal */}
            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">
                        Material
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nome do material"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>

            <Separator />

            {/* Ação Final */}
            <div className="flex justify-end pt-4">
                <Button type="submit" className="w-full md:w-auto px-8 gap-2 bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4" />
                    Salvar
                </Button>
            </div>
        </form>
    );
}