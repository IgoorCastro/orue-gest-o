// Mapeamento para exibição
// dos tipos de movimentação de estoque

export function mapMovimentType(type: string): string {
    switch (type) {
        case "INBOUND":
            return "Entrada";
        case "OUTBOUND":
            return "Saida";
        case "TRANSFER":
            return "Trasnferencia";
        default:
            return "Não definido";
    }
}
