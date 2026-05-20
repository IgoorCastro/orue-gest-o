// Mapeamento para exibição
// dos tipos de usuários

export function mapUserType(type: string): string {
    switch (type) {
        case "ADMIN":
            return "Administrador";
        case "MANAGER":
            return "Gerente";
        case "OPERATOR":
            return "Operador";
        default:
            return "Desconhecido";
    }
}