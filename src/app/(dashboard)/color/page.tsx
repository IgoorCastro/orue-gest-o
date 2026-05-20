"use client";

import { Color } from "@/src/ui/types/color";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { ColorForm } from "@/src/ui/components/shared/forms/color-form";
import { Plus } from "lucide-react";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { ColorDetailsForm } from "@/src/ui/components/shared/forms/color-details-form";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { useColor } from "./hooks/use-color";
import { useColorPageState } from "./hooks/use-color-page-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { CustomButton } from "@/src/ui/components/shared/ui/button";

export default function ColorsPage() {
  const {
    colors,
    loading,

    setRefreshSignal,

    handleConfirmdDeactivation,
    handleRestoreColor,
    isDisableColor,
  } = useColor();

  const {
    openCrudModal,
    openItemModal,
    selectedColor,

    setOpenCrudModal,
    setOpenItemModal,

    openItemDetails,
    openCreateModal,
    openEditModal,
  } = useColorPageState();

  if (loading) return <DefaultLoading />

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between items-center mb-5 py-4 px-5 rounded-2xl border">
        <h1 className="text-lg sm:text-2xl font-bold">Cores</h1>
        <div className="flex w-auto">
          <CustomButton
            text="Nova cor"
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
              {/* Seguindo o padrão de padding e fonte da Base */}
              <TableHead className="w-full pl-10 py-5 text-lg font-bold">Cor</TableHead>
              <TableHead className="px-8 md:px-15 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {colors.length > 0 ? (
              colors.map((color) => (
                <TableRow
                  key={color.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Nome com capitalização elegante e clique para detalhes */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(color)}
                  >
                    {color.name}
                  </TableCell>

                  {/* Coluna Ações centralizada para Cores */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                    onClick={(e) => {
                      openItemDetails(color);
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableColor(color.deletedAt)}
                        onEdit={() => openEditModal(color)}
                        onDelete={() => handleConfirmdDeactivation(color.id)}
                        onRestore={() => handleRestoreColor(color.id)}
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
                  Nenhuma cor encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResponsiveModal
        title="Detalhes da cor"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações da cor."
        size="sm"
      >
        {selectedColor && <ColorDetailsForm color={selectedColor} />}
      </ResponsiveModal>

      <CrudModal
        title={selectedColor ? "Editar Cor" : "Nova cor"}
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <ColorForm
          initialData={selectedColor}
          onSuccess={(newColor: Color) => {
            setRefreshSignal(prev => !prev)
            setOpenCrudModal(false);
          }}
        />
      </CrudModal>
    </div>
  );
}