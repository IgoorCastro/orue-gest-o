// hook responsavel pelo gerenciamento das inputs
// e do envio dos dados para o service

import { feedback } from "@/src/ui/lib/feedback";
import { StockService } from "@/src/ui/services/stock.service";
import { Stock } from "@/src/ui/types/stock";
import { Store } from "@/src/ui/types/store";
import { useEffect, useMemo, useState } from "react";

export enum StockType {
  MAIN = "MAIN",
  STORE = "STORE",
}

type Props = {
  initialData?: Stock
  onSuccess: () => void
}

export function useStockForm({ initialData, onSuccess }: Props) {
  // ESTADOS DE INPUTS
  const [name, setName] = useState<string>("");
  const [storeId, setStoreId] = useState<string>("");
  const [store, setstore] = useState<Store | null>(null);
  const [type, setType] = useState<StockType>(StockType.STORE);

  const stock = useMemo(() => new StockService("/stock"), []);

  useEffect(() => {
    if (initialData) mapStock(initialData);
  }, [initialData]);

  const mapStock = (initialData: Stock) => {
    setName(initialData.name);
    setStoreId(initialData.storeId ?? "");
    setstore(initialData.store ?? null)
    setType(initialData.type as StockType)
  }

  // funções de envio de dados
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    feedback.loading("Processando entrada estoque...");

    try {
      initialData ? await handleUpdate(stock) : await handleCreate(stock);
      feedback.dismiss();
      feedback.success(initialData ? 'Atualização de modelo realizada com sucesso!' : 'Entrada de modelo realizada com sucesso!')
      onSuccess(); // função para acionar o refresh
    } catch (error) {
      feedback.dismiss();
      feedback.error(error);
    }
  };

  const handleCreate = async (stockService: StockService) => {
    return await stockService.create({ name, type, storeId })
  }

  const handleUpdate = async (stockService: StockService) => {
    if (initialData)
      return await stockService.update(initialData.id, { name, type, storeId })
  }

  return {
    // campos
    name,
    storeId,
    type,

    // setters
    setName,
    setType,
    setStoreId,

    // funcões de envio
    handleSubmit,
  };
}