// hook para controle de estados da pagina stock
// controla abertura de modals e o conteudo
// de exibição das modais

import { Stock } from "@/src/ui/types/stock";
import { useState } from "react";

export function useStockPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedStock, setSelectedStock] = useState<Stock | undefined>(undefined);

    const openEditModal = (stock: Stock): void => {
        setSelectedStock(stock);
        setOpenCrudModal(true);
    }

    // Limpa o estado e abre a modal
    const openCreateModal = (): void => {
        setSelectedStock(undefined);
        setOpenCrudModal(true);
    }

    // controle da modal de exibição do estoque
    const openItemDetails = (stock: Stock): void => {
        setSelectedStock(stock);
        setOpenItemModal(true);
    }

    return {
        // campos/ fields
        openItemModal,
        openCrudModal,
        selectedStock,

        // setters
        setOpenCrudModal,
        setSelectedStock,
        setOpenItemModal,

        // funções de controle
        openEditModal,
        openCreateModal,
        openItemDetails,
    }
}