// hook de estados responsável por gerenciar o ciclo de vida dos componentes

import { Store } from "@/src/ui/types/store";
import { useState } from "react";

export function useStorePageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | undefined>(undefined);

    const openEditModal = (store: Store): void => {
        setSelectedStore(store);
        setOpenCrudModal(true);
    }

    // Abre a modal e limpa o estado
    const openCreateModal = () => {
        setSelectedStore(undefined);
        setOpenCrudModal(true);
    }

    // controle da modal de exibição do estoque
    const openItemDetails = (store: Store): void => {
        setSelectedStore(store);
        setOpenItemModal(true);
    }

    return {
        openCrudModal,
        openItemModal,
        selectedStore,

        openEditModal,
        openCreateModal,
        openItemDetails,
        
        setOpenCrudModal,
        setOpenItemModal,
        setSelectedStore,
    }
}