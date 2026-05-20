"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { ProductService } from "@/src/ui/services/product.service";
import { StockService } from "@/src/ui/services/stock.service";
import { ProductStock } from "@/src/ui/types/product-stock-with-relations";
import { Stock } from "@/src/ui/types/stock";
import { StockMoviment } from "@/src/ui/types/stock-moviment";
import { BaseServicePaginated } from "@/src/ui/services/base-pagination.service";

export default function OperatorDashboard() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalStocks, setTotalStocks] = useState<number>(0);
  const [totalProductStocks, setTotalProductStocks] = useState<number>(0);
  const [recentMovements, setRecentMovements] = useState<StockMoviment[]>([]);
  const [lowStockItems, setLowStockItems] = useState<ProductStock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const stockService = useMemo(() => new StockService("/stock"), []);
  const productService = useMemo(() => new ProductService("/product"), []);
  const productStockService = useMemo(() => new ProductStockService("/productStock"), []);
  const stockMovimentService = useMemo(() => new BaseServicePaginated<StockMoviment>("/stockMoviment"), []);

  useEffect(() => {
    async function loadBaseData() {
      setLoading(true);
      setError("");

      try {
        const [stockList, productPage, recentMovimentList, productStockPage] = await Promise.all([
          stockService.findAll(),
          productService.findAll({ page: 1, limit: 1 }),
          stockMovimentService.findAll({ limit: 50, page: 1, orderBy: "createdAt:desc" }),
          productStockService.findAll({ page: 1, limit: 1 }),
        ]);

        setStocks(stockList);
        setTotalProducts(productPage.total);
        setTotalStocks(stockList.length);
        setRecentMovements(recentMovimentList.data ?? []);
        setTotalProductStocks(productStockPage.total);

        const globalValue = await productStockService.getTotalValue({});
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os dados do dashboard. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    }

    loadBaseData();
  }, []);

  useEffect(() => {
    async function loadSelectedStockData() {
      setLoading(true);
      setError("");

      try {
        // Sempre busca esses 3 primeiros
        const basePromises = [
          productStockService.getTotalValue({ stockId: selectedStockId || undefined }),
          productStockService.findAll({ stockId: selectedStockId || undefined, page: 1, limit: 1 }),
          productStockService.findAll({ stockId: selectedStockId || undefined, page: 1, limit: 5, orderBy: "quantity:asc" }),
        ];

        let additionalPromises: any[] = [];

        if (selectedStockId) {
          // Com filtro: busca apenas movimentações do estoque específico
          additionalPromises = [
            stockMovimentService.findAll({
              filterStock: selectedStockId,
              limit: 10,
              page: 1,
              orderBy: "createdAt:desc"
            })
          ];
        } else {
          // Sem filtro: busca mais movimentações E dados atuais de estoque
          additionalPromises = [
            stockMovimentService.findAll({ limit: 100, page: 1, orderBy: "createdAt:desc" }),
            productStockService.findAll({ page: 1, limit: 1000 }) // ← Busca dados atuais de estoque
          ];
        }

        const [valueResponse, stockSummary, lowStockResponse, ...remaining] = await Promise.all([
          ...basePromises,
          ...additionalPromises
        ]);

        // Processa os resultados base (sempre presentes)
        setTotalProductStocks((stockSummary as any).total);
        setLowStockItems((lowStockResponse as any).data ?? []);

        if (selectedStockId) {
          // Com filtro: remaining[0] são as movimentações
          const stockMovements = remaining[0] as any;
          setRecentMovements(stockMovements.data ?? []);
        } else {
          // Sem filtro: remaining[0] = movimentações, remaining[1] = dados atuais de estoque
          const stockMovements = remaining[0] as any;
          const currentStockDataResponse = remaining[1] as any;
          setRecentMovements(stockMovements.data ?? []);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do estoque selecionado.");
      } finally {
        setLoading(false);
      }
    }

    loadSelectedStockData();
  }, [selectedStockId]);

  if (loading ) {
    return (
      <main className="flex-1 p-6">
        <div className="rounded-2xl p-8 bg-card shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-base text-slate-600 dark:text-slate-300">Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-screen overflow-hidden border p-2 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <h1>
        DASHBOARD DO OPERADOR
      </h1>
    </main>
  );
} 