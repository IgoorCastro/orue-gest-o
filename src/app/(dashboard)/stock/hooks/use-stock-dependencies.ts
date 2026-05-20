// retorna toda dependencia necessaria para criar um novo produto
// loading disponivel

import { useEffect, useMemo, useState } from "react";

import { Store } from "@/src/ui/types/store";
import { StoreService } from "@/src/ui/services/store.service";

export function useStockDependencies() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    const storeService = useMemo(() => new StoreService("/store"), []);


    useEffect(() => {
        async function load() {
            try {
                const storeRes = await storeService.findAll();
                setStores(storeRes);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        stores,
        loading,
    };
}