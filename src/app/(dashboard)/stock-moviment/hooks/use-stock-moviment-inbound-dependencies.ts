// retorna toda dependencias necessaria para criar um novo registor de movimento de estoque
// loading disponivel

import { useEffect, useMemo, useState } from "react";
import { Stock } from "@/src/ui/types/stock";
import { StockService } from "@/src/ui/services/stock.service";

export function useStockMovimentInboundDependencies() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    const stockService = useMemo(() => new StockService("/stock"), []);

    useEffect(() => {
        async function load() {
            try {
                const stockRes = await stockService.findAll({ type: "MAIN" });
                setStocks(stockRes);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        stocks,
        loading,
    };
}