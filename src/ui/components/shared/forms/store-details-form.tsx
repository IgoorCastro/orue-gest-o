import { Separator } from "@/src/ui/components/ui/separator";
import { Label } from "@/src/ui/components/ui/label";
import { format } from "date-fns";
import DefaultLoading from "../ui/loading-default";
import { Store } from "@/src/ui/types/store";

type StoreDetailsFormProps = {
  store: Store;
};

export function StoreDetailsForm({ store }: StoreDetailsFormProps) {
  
  // Helper para campos de exibição
  const InfoField = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col space-y-1">
      <Label className="text-xs text-muted-foreground uppercase font-bold">{label}</Label>
      <div className="text-sm font-medium">{value || "---"}</div>
    </div>
  );
  
  if (!store) return <DefaultLoading />

  return (
    <div className="space-y-6"><div className="flex justify-between items-center border-b pb-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider">Ficha do estoque</h2>
      <div className="w-min flex flex-row gap-3 items-center justify-center mr-5">
        <Label className="text-xs text-muted-foreground uppercase font-bold mt-0.5">{store.deletedAt ? "Desativo" : "Ativo"}</Label>
        {store.deletedAt
          ? <span className="h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
          : <span className="h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
        }
      </div>
    </div>

      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Nome do Estoque" value={store.name[0].toUpperCase() + store.name.slice(1)} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
          <InfoField
          label="Criado em"
          value={store.createdAt ? format(new Date(store.createdAt), "dd/MM/yyyy HH:mm") : undefined}
        />
        <div className="flex justify-end ">
          <InfoField
          label="Última Atualização"
          value={store.updatedAt ? format(new Date(store.updatedAt), "dd/MM/yyyy HH:mm") : undefined}
        />
        </div>
      </div>
    </div>
  );
}