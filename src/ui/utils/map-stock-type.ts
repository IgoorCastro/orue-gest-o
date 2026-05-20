// Mapeamento para exibição
// dos tipos de estoques

export function mapStockType(type: string): string {
    switch (type) {
        case "MAIN":
            return "Principal";
        case "STORE":
            return "Loja";
        default:
            return "Desconhecido";
    }
}