// componente de loading padrão
// pode receber um título para
// exibição

import { Package } from "lucide-react"

type Props = {
    title?: string,
}

export default function DefaultLoading({ title = "Carregando dados..." }: Props) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center py-10 text-muted-foreground animate-pulse">
            <Package className="h-8 w-8 mb-2" />
            <p> {title} </p>
        </div>
    );
}