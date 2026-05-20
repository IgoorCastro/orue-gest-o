// hook de estados responsável por gerenciar o ciclo de vida dos componentes

import { Color } from "@/src/ui/types/color";
import { useState } from "react";

export function useColorPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<Color | undefined>(undefined);
    const [openItemModal, setOpenItemModal] = useState(false);

    const openItemDetails = (color: Color): void => {
        setSelectedColor(color);
        setOpenItemModal(true);
    }

    // Limpa o estado e abre a modal
    const openCreateModal = () => {
        setSelectedColor(undefined);
        setOpenCrudModal(true);
    }

    // Limpa o estado e abre a modal
    const openEditModal = (color: Color) => {
        setSelectedColor(color);
        setOpenCrudModal(true);
    }

    return {
        // campos
        openCrudModal,
        openItemModal,
        selectedColor,

        // setters
        setOpenCrudModal,
        setOpenItemModal,

        // utils
        openItemDetails,
        openCreateModal,
        openEditModal,
    }
}