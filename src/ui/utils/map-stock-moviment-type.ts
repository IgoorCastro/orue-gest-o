// Mapeamento para exibição
// dos tipos de movimentação de estoque

export function mapStockMovimentType(type: string): string {
    switch (type) {
        case "INBOUND":
            return "Entrada";
        case "OUTBOUND":
            return "Saida";
        case "TRANSFER":
            return "Transferência";
        default:
            return "Desconhecido";
    }
}