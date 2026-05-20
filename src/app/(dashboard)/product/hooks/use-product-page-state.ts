// Hook para controle de estados UI
// tratar aqui o controle de elementos da pagina

import { Product } from "@/src/ui/types/product";
import { useState } from "react";

export function useProductPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

    return {
        openCrudModal,
        openFilterModal,
        openItemModal,
        selectedProduct,

        setOpenCrudModal,
        setOpenFilterModal,
        setOpenItemModal,
        setSelectedProduct,
    };
}