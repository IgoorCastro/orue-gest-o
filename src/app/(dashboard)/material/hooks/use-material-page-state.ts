// hook de estados responsável por gerenciar o ciclo de vida dos componentes

import { Material } from "@/src/ui/types/material";
import { useState } from "react";

export function useMaterialPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
    const [openItemModal, setOpenItemModal] = useState(false);

    const openItemDetails = (material: Material): void => {
        setSelectedMaterial(material);
        setOpenItemModal(true);
    }

    // Limpa o estado e abre a modal
    const openCreateModal = () => {
        setSelectedMaterial(undefined);
        setOpenCrudModal(true);
    }

    // Limpa o estado e abre a modal
    const openEditModal = (material: Material) => {
        setSelectedMaterial(material);
        setOpenCrudModal(true);
    }

    return {
        openCrudModal,
        selectedMaterial,
        openItemModal,

        setOpenCrudModal,
        setOpenItemModal,

        openItemDetails,
        openCreateModal,
        openEditModal,
    }
}