"use client";

import { Store } from "@/src/ui/types/store";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { Plus } from "lucide-react";
import { StoreForm } from "@/src/ui/components/shared/forms/store-form";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { StoreDetailsForm } from "@/src/ui/components/shared/forms/store-details-form";
import { useStore } from "./hooks/use-store";
import { useStorePageState } from "./hooks/use-store-page-state";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { CustomButton } from "@/src/ui/components/shared/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";

export default function StoresPage() {
  const {
    stores,
    loading,

    setRefreshSignal,

    handleConfirmdDeactivation,
    handleRestoreProduct,
    isDisableStore,
  } = useStore();

  const {
    openItemModal,
    openCrudModal,
    selectedStore,

    openCreateModal,
    openEditModal,
    openItemDetails,

    setOpenCrudModal,
    setOpenItemModal,
  } = useStorePageState();

  if (loading) return <DefaultLoading />

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Lojas</h1>        
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
              {/* Padrão pl-10, py-5 e text-lg font-bold */}
              <TableHead className="w-full pl-10 py-5 text-lg font-bold">Loja</TableHead>
              <TableHead className="px-8 md:px-15 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stores.length > 0 ? (
              stores.map((store) => (
                <TableRow
                  key={store.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Nome: Mantendo o uppercase das Lojas */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(store)}
                  >
                    {store.name.toUpperCase()}
                  </TableCell>

                  {/* Coluna Ações: Seguindo fielmente sua base de cliques */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                    onClick={(e) => {
                      openItemDetails(store);
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableStore(store.deletedAt)}
                        onEdit={() => openEditModal(store)}
                        onDelete={() => handleConfirmdDeactivation(store.id)}
                        onRestore={() => handleRestoreProduct(store.id)}
                        disabled={loading}
                        onSucces={() => setRefreshSignal(prev => !prev)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                  Nenhuma loja encontrada.
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
        {selectedStore && <StoreDetailsForm store={selectedStore} />}
      </ResponsiveModal>

      <CrudModal
        title={selectedStore ? "Editar Loja" : "Novo Loja"}
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <StoreForm
          initialData={selectedStore}
          onSuccess={(newStore: Store) => {
            setRefreshSignal(prevs => !prevs);
            setOpenCrudModal(false);
          }}
        />
      </CrudModal>
    </div>
  );
}