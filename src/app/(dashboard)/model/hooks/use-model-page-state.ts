// hook de estados responsável por gerenciar o ciclo de vida dos componentes

import { Model } from "@/src/ui/types/model";
import { useState } from "react";

export function useModelPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);

    const openItemDetails = (model: Model): void => {
        setSelectedModel(model);
        setOpenItemModal(true);
    }

    // Limpa o estado e abre a modal
    const openCreateModal = () => {
        setSelectedModel(undefined);
        setOpenCrudModal(true);
    }

    // Limpa o estado e abre a modal
    const openEditModal = (model: Model) => {
        setSelectedModel(model);
        setOpenCrudModal(true);
    }

    return {
        openCrudModal,
        openItemModal,
        selectedModel,

        setOpenCrudModal,
        setOpenItemModal,

        openCreateModal,
        openEditModal,
        openItemDetails,
    }

}