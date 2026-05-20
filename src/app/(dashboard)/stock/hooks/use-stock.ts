// hook responsavel por gerenciar a lista
// de exibição do estoque, ativar, desativar
// e controle de refresh na pagina

import { feedback } from "@/src/ui/lib/feedback";
import { StockService } from "@/src/ui/services/stock.service";
import { Stock } from "@/src/ui/types/stock";
import { useEffect, useMemo, useState } from "react";

export function useStock() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // estado de loading
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);
    
    const stockService = useMemo(() => new StockService("/stock"), []);

    useEffect(() => {
        setLoading(true);
        stockService.findAll()
            .then((res) => {
                setStocks(res);
            })
            .finally(() => setLoading(false))
            .catch(console.error);
    }, [refreshSignal]);

    // função para desativar um produto
    const handleConfirmdDeactivation = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando produto..")
        stockService.delete(productId)
            .then(() => feedback.dismiss())
            .catch(feedback.error)
            .finally(() => {
                feedback.success("Produto desativado!");
                setLoading(false);
            });
    }

    // função para resturar um produto desativado
    const handleRestoreProduct = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando produto..")
        stockService.restore(productId)
            .then(() => feedback.dismiss())
            .catch(feedback.error)
            .finally(() => {
                feedback.success("Produto reativado!");
                setLoading(false);
            });
    }

    // função para verificar se um estoque está desabilitado
    // caso deletedAt esteja presente não seja null ou undefined
    // esse produto está desativado!
    const isDisabledStock = (deletedAt?: string): boolean => {
        return !!deletedAt;
    }

    return {
        stocks,
        refreshSignal,
        loading,

        setStocks,
        setRefreshSignal,

        handleConfirmdDeactivation,
        handleRestoreProduct,
        isDisabledStock,
    }
}