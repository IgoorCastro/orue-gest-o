import { ProductComponentService } from "@/src/ui/services/product-component.service";
import { ProductComponent } from "@/src/ui/types/product-component";
import { useEffect, useMemo, useState } from "react";

export function useProductDetailsDependencies(filter?: any) {
    const [productComponents, setProductComponents] = useState<ProductComponent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const pcService = useMemo(() => new ProductComponentService("/productComponent"), []);

    useEffect(() => {
        // só faz a request se tiver filtro
        if (filter) {
            async function load() {
                const pcs = await pcService.findAll(filter);

                setProductComponents(pcs);
                setLoading(false);
            }
            load();
        } else
            setLoading(false)
    }, [])

    return {
        productComponents,
        loading,
    }
}