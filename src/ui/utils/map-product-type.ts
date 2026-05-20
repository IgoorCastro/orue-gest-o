// Mapeamento para exibição
// dos tipos de produtos

export function mapProductType(type: string): string {
    switch (type) {
        case "PRODUCT":
            return "Produto";
        case "KIT":
            return "Kit";
        case "PACKAGE":
            return "Pacote";
        default:
            return "Desconhecido";
    }
}