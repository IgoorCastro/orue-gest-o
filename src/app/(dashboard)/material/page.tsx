"use client";

import { Material } from "@/src/ui/types/material";
import { Plus } from "lucide-react";
import { MaterialForm } from "@/src/ui/components/shared/forms/material-form";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { MaterialDetailsForm } from "@/src/ui/components/shared/forms/material-details-form";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { useMaterialPageState } from "./hooks/use-material-page-state";
import { useMaterial } from "./hooks/use-material";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { CustomButton } from "@/src/ui/components/shared/ui/button";

export default function MaterialsPage() {
  const {
    materials,
    loading,

    setRefreshSignal,

    handleConfirmdDeactivation,
    handleRestoreMaterial,
    isDisableMaterial,
  } = useMaterial();

  const {
    openCrudModal,
    selectedMaterial,
    openItemModal,

    setOpenCrudModal,
    setOpenItemModal,

    openItemDetails,
    openCreateModal,
    openEditModal,
  } = useMaterialPageState();

  if (loading) return <DefaultLoading />

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Materiais</h1>
        <div className="flex w-auto">
          <CustomButton
            text="Novo material"
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
              {/* Mantendo o padrão de 10px de padding e texto em destaque */}
              <TableHead className="w-full pl-10 py-5 text-lg font-bold">Material</TableHead>
              <TableHead className="px-8 md:px-15 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {materials.length > 0 ? (
              materials.map((material) => (
                <TableRow
                  key={material.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Nome: Clique abre detalhes, texto capitalizado e elegante */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(material)}
                  >
                    {material.name}
                  </TableCell>

                  {/* Coluna Ações: Stop Propagation para não disparar o clique da linha */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                    onClick={(e) => {
                      openItemDetails(material)
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableMaterial(material.deletedAt)}
                        onEdit={() => openEditModal(material)}
                        onDelete={() => handleConfirmdDeactivation(material.id)}
                        onRestore={() => handleRestoreMaterial(material.id)}
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
                  Nenhum material encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResponsiveModal
        title="Detalhes do Material"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações do material."
        size="sm"
      >
        {selectedMaterial && <MaterialDetailsForm material={selectedMaterial} />}
      </ResponsiveModal>

      <CrudModal
        title={selectedMaterial ? "Material" : "Novo Material"}
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <MaterialForm
          initialData={selectedMaterial}
          onSuccess={(newMaterial: Material) => {
            setRefreshSignal(prev => !prev);
            setOpenCrudModal(false);
          }}
        />
      </CrudModal>
    </div>
  );
}