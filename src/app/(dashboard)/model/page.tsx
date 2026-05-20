"use client";

import { Plus } from "lucide-react";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { ModelForm } from "@/src/ui/components/shared/forms/model-form";
import { Model } from "@/src/ui/types/model";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { ModelDetailsForm } from "@/src/ui/components/shared/forms/model-details-form";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { useModel } from "./hooks/use-model";
import { useModelPageState } from "./hooks/use-model-page-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { CustomButton } from "@/src/ui/components/shared/ui/button";

export default function MaterialsPage() {
  const {
    models,
    loading,

    setRefreshSignal,

    handleConfirmdDeactivation,
    handleRestoreProduct,
    isDisableModel,
  } = useModel();

  const {
    openCrudModal,
    openItemModal,
    selectedModel,

    setOpenCrudModal,
    setOpenItemModal,

    openCreateModal,
    openEditModal,
    openItemDetails,
  } = useModelPageState();

  if (loading) return <DefaultLoading />

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Modelos</h1>
        <div className="flex w-auto">
          <CustomButton
            text="Novo modelo"
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
              <TableHead className="w-full pl-10 py-5 text-lg font-bold">Modelo</TableHead>
              <TableHead className="px-8 md:px-15 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {models.length > 0 ? (
              models.map((model) => (
                <TableRow
                  key={model.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Nome: Clique simples */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(model)}
                  >
                    {model.name}
                  </TableCell>

                  {/* Coluna Ações: Exatamente como sua Base da Cor */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                    onClick={(e) => {
                      openItemDetails(model);
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableModel(model.deletedAt)}
                        onEdit={() => openEditModal(model)}
                        onDelete={() => handleConfirmdDeactivation(model.id)}
                        onRestore={() => handleRestoreProduct(model.id)}
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
                  Nenhum modelo encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResponsiveModal
        title="Detalhes do Modelo"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações do modelo."
        size="sm"
      >
        {selectedModel && <ModelDetailsForm model={selectedModel} />}
      </ResponsiveModal>

      <CrudModal
        title={selectedModel ? "Editar Modelo" : "Novo Modelo"}
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <ModelForm
          initialData={selectedModel}
          onSuccess={(newModel: Model) => {
            setOpenCrudModal(false);
            setRefreshSignal(prevs => !prevs)
          }}
        />
      </CrudModal>
    </div>
  );
}