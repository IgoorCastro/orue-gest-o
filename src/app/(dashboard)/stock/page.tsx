"use client";

import { Plus } from "lucide-react";
import { useStock } from "./hooks/use-stock";
import { useStockPageState } from "./hooks/use-stock-page-state";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/ui/components/ui/table"
import { Badge } from "@/src/ui/components/ui/badge"
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { StockDetailsForm } from "@/src/ui/components/shared/forms/stock-details-form";
import { CustomButton } from "@/src/ui/components/shared/ui/button";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { StockForm } from "@/src/ui/components/shared/forms/stock-form";

export default function StocksPage() {
  const {
    stocks,
    loading,

    setRefreshSignal,
    handleConfirmdDeactivation,
    handleRestoreProduct,
    isDisabledStock,
  } = useStock();

  // hook dos estados da página
  const {
    openCrudModal,
    selectedStock,
    openItemModal,

    openEditModal,
    openCreateModal,
    openItemDetails,

    setOpenCrudModal,
    setOpenItemModal,
  } = useStockPageState();

  if (loading) return <DefaultLoading />;

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Estoque</h1>
        <div className="flex w-auto">
          <CustomButton
            text="Nova loja"
            icon={<Plus size={18} />}
            variant="default"
            className="text-xs"
            onClick={() => openCreateModal()}
          />
        </div>
      </div>

      <div className="w-[98%] md:min-w-[50%] md:w-auto rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-10 pr-10 py-5 text-lg font-bold">Loja</TableHead>
              <TableHead className="px-20 py-5 text-lg text-center font-bold">Nome</TableHead>
              <TableHead className="px-10 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <TableRow
                  key={stock.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Loja com um Badge para dar um destaque visual */}
                  <TableCell onClick={() => openItemDetails(stock)}>
                    <Badge variant="ghost" className="px-7 py-4 text-md font-semibold uppercase tracking-wider">
                      {stock.store?.name}
                    </Badge>
                  </TableCell>

                  {/* Coluna Nome com capitalização elegante */}
                  <TableCell
                    className="p-3 text-center font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(stock)}
                  >
                    {stock.name}
                  </TableCell>

                  {/* Coluna Ações alinhada à direita */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                    onClick={(e) => {
                      openItemDetails(stock);
                      e.stopPropagation();
                    }}
                  >
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisabledStock(stock.deletedAt)}
                        onEdit={() => openEditModal(stock)}
                        onDelete={() => handleConfirmdDeactivation(stock.id)}
                        onRestore={() => handleRestoreProduct(stock.id)}
                        disabled={loading}
                        onSucces={() => setRefreshSignal(prev => !prev)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  Nenhum item encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResponsiveModal
        title="Detalhes do Estoque"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações do estoque."
        size="sm"
      >
        {selectedStock && <StockDetailsForm stock={selectedStock} />}
      </ResponsiveModal>

      <CrudModal
        title="Novo estoque"
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <StockForm
          initialData={selectedStock}
          onSuccess={() => {
            setOpenCrudModal(false);
            setRefreshSignal(prev => !prev);
          }}
        />
      </CrudModal>
    </div>
  );
}