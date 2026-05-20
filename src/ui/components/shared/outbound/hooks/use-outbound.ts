// hook de domínio responsável pela gestão do ciclo de vida de saidas

import { feedback } from "@/src/ui/lib/feedback";
import { useUser } from "@/src/ui/contexts/user-context";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { StockMovimentService } from "@/src/ui/services/stock-moviment.service";
import { ProductStock } from "@/src/ui/types/product-stock";
import { useEffect, useMemo, useState } from "react";

export function useOutbound() {
    // estado de listas
    const [items, setItems] = useState<any[]>([]);
    const [avaliableProductStocks, setAvaliableProductStocks] = useState<ProductStock[]>([]);

    // estado de seleções do usuario
    const [selectedPS, setSelectedPS] = useState<ProductStock | null>(null); // produto em estoque selecionado

    // estado da input de pesquisa do produto 
    const [searchProduct, setSearchProduct] = useState("");

    // estados para definições para transferencia do item atual
    const [fromStock, setFromStock] = useState(""); // estoque de destino
    const [productStockId, setProductStockId] = useState(""); // id do produto selecionado
    const [quantity, setQuantity] = useState(1); // quantidade

    const [loading, setLoading] = useState<boolean>(true); // loading do hook

    // usuário do contexto
    const user = useUser();

    // Memoizar a service para evitar múltiplas instâncias
    const psService = useMemo(() => new ProductStockService("/productStock"), []);

    // Efeito para buscar produtos SEMPRE que o estoque de origem mudar
    useEffect(() => {
        setLoading(true);
        if (!fromStock) {
            setAvaliableProductStocks([]);
            setLoading(false);
            return;
        }
        const handler = setTimeout(() => {
            psService.findByStock({ stockId: fromStock, productName: searchProduct })
                .then((res) => {
                    // Filtramos apenas produtos que possuem saldo para saída
                    setAvaliableProductStocks(res.data.filter(ps => ps.quantity > 0));
                    setLoading(false);
                })
                .catch((err) => feedback.error(err));
        }, 500);

        return () => {
            clearTimeout(handler);
            setLoading(false);
        };

    }, [fromStock, searchProduct]);

    const handleAddItem = () => {
        if (!selectedPS || !fromStock || quantity <= 0) {
            feedback.error("Selecione um produto e uma quantidade válida.");
            return;
        }

        // Validação de estoque insuficiente antes de adicionar ao carrinho
        if (quantity > selectedPS.quantity) {
            feedback.error(`Saldo insuficiente! Disponível: ${selectedPS.quantity}`);
            return;
        }

        const newItem = {
            productStockId: selectedPS.id, // O ID da relação estoque-produto
            name: selectedPS.product?.name,
            size: selectedPS.product?.size,
            quantity,
            unitPrice: selectedPS.product?.price || 0,
            totalPrice: (selectedPS.product?.price || 0) * quantity,
            fromStockId: fromStock
        };

        setItems([...items, newItem]);

        // Limpa campos de produto
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const clearState = () => {
        setItems([]);
        setFromStock("");
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        
        // verifica se há um usuario conectado
        if (!user) {
            feedback.error("Usuário não autenticado. Faça login para registrar movimentações.");
            return;
        }

        const toastId = feedback.loading("Processando saída de produtos...");

        try {
            const sm = new StockMovimentService("/stockMoviment");

            const promises = items.map(item =>
                sm.create({
                    productStockId: item.productStockId,
                    fromStockId: item.fromStockId, // Agora enviamos FROM ao invés de TO
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    type: "OUTBOUND", // Tipo fixo para esta página
                    userId: user.id
                })
            );

            await Promise.all(promises);

            feedback.dismiss(toastId);
            feedback.success(`Saída de ${items.length} itens realizada com sucesso!`);
            clearState();
        } catch (error) {
            feedback.dismiss(toastId);
            feedback.error(error);
        }
    };

    return {
        // campos
        items,
        avaliableProductStocks,
        fromStock,
        productStockId,
        quantity,
        loading,

        setItems,
        setFromStock,
        setProductStockId,
        setSelectedPS,
        setSearchProduct,
        setQuantity,

        // utils
        handleSubmit,
        handleAddItem,
        removeItem,
    }
}