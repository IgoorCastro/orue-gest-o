// hook de domínio responsável pela gestão do ciclo de vida de tranferencias 

import { useEffect, useState } from "react";
import { feedback } from "@/src/ui/lib/feedback";
import { useUser } from "@/src/ui/contexts/user-context";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { StockMovimentService } from "@/src/ui/services/stock-moviment.service";
import { ProductStock } from "@/src/ui/types/product-stock";


export function useTrasnfer() {
    // estados de lista
    const [items, setItems] = useState<any[]>([]); // lista de items selecionados pelo usuario
    const [avaliableProductStocks, setAvaliableProductStocks] = useState<ProductStock[]>([]); // lista de produtos disponiveis no estoque selecionado

    // estado de seleções do usuario      
    const [selectedPS, setSelectedPS] = useState<ProductStock | null>(null); // produto em estoque selecionado pelo usuario    

    // estado da input de pesquisa do produto 
    const [searchProduct, setSearchProduct] = useState("");

    // estados para definições para transferencia do item atual
    const [toStock, setToStock] = useState(""); // estoque de origem
    const [fromStock, setFromStock] = useState(""); // estoque de destino
    const [productStockId, setProductStockId] = useState(""); // produto selecionado para transferencia
    const [quantity, setQuantity] = useState(1); // quantidade para transferencia
    
    const [loading, setLoading] = useState<boolean>(true); // loading do hook
    
    // usuário do contexto
    const user = useUser();

    const psService = new ProductStockService("/productStock");

    // Efeito para buscar produtos da ORIGEM
    useEffect(() => {        
            setLoading(true);
        if (!fromStock) {
            setAvaliableProductStocks([]);
            setLoading(false);
            return;
        }

        const handler = setTimeout(() => {
            psService.findByStock({ stockId: fromStock, productName: searchProduct }) // TA DANDO ERRO AQUI
                .then((res) => {
                    // filtrando apenas produtos que possuem saldo para saída
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
        if (!selectedPS || !fromStock || !toStock || quantity <= 0) {
            feedback.error("Preencha origem, destino, produto e quantidade.");
            return;
        }

        if (fromStock === toStock) {
            feedback.error("O estoque de destino não pode ser igual ao de origem.");
            return;
        }

        if (quantity > selectedPS.quantity) {
            feedback.error(`Saldo insuficiente na origem! Disponível: ${selectedPS.quantity}`);
            return;
        }

        const newItem = {
            productStockId: selectedPS.id,
            name: selectedPS.product?.name,
            size: selectedPS.product?.size,
            quantity,
            unitPrice: selectedPS.product?.price || 0,
            totalPrice: (selectedPS.product?.price || 0) * quantity,
            fromStockId: fromStock,
            toStockId: toStock
        };

        setItems([...items, newItem]);
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
        setToStock("");
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        
        // verifica se há um usuario conectado
        if (!user) {
            feedback.error("Usuário não autenticado. Faça login para registrar movimentações.");
            return;
        }

        const toastId = feedback.loading("Processando transferência...");

        try {
            const sm = new StockMovimentService("/stockMoviment");

            const promises = items.map(item =>
                sm.create({
                    productStockId: item.productStockId,
                    fromStockId: item.fromStockId,
                    toStockId: item.toStockId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    type: "TRANSFER",
                    userId: user.id,
                })
            );

            await Promise.all(promises);

            feedback.dismiss(toastId);
            feedback.success(`${items.length} transferências realizadas com sucesso!`);
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
        toStock,
        productStockId,
        quantity,
        loading,

        // setters
        setItems,
        setFromStock,
        setToStock,
        setQuantity,
        setProductStockId,
        setSelectedPS,
        setSearchProduct,

        // utils
        handleSubmit,
        handleAddItem,
        removeItem,
    }
}