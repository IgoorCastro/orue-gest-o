import { ProductService } from "@/src/ui/services/product.service";
import { StockService } from "@/src/ui/services/stock.service";
import { Product } from "@/src/ui/types/product";
import { Stock } from "@/src/ui/types/stock";
import { useEffect, useMemo, useState } from "react";

export function useProductStockFilterDependencies() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const productService = useMemo(() => new ProductService("/product"), []);
    const stockService = useMemo(() => new StockService("/stock"), []);

    useEffect(() => {
        async function load() {
            try {
                const [products, stocks] = await Promise.all([
                    productService.findAll({ orderBy: "name: desc" }),
                    stockService.findAll({ orderBy: "name: desc" }),
                ]);

                setProducts(products.data);
                setStocks(stocks);
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return {
        products,
        stocks,
        loading,
    }
}