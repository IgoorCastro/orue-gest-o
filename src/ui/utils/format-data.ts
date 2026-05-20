// frontend/src/app/utils/format-date.ts

export function formatDate(date: Date | string | number | null | undefined): string {
    // 1. Tratamento para valores nulos ou indefinidos (comum em campos como deletedAt)
    if (!date) {
        return ""; // Ou return "-" se preferir mostrar algo na tabela
    }

    // 2. Tenta converter para objeto Date
    const d = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;

    // 3. Valida se a conversão resultou em uma data real
    if (isNaN(d.getTime())) {
        return "Data inválida";
    }

    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        dateStyle: 'short',
        timeStyle: 'medium',
    }).format(d);
}