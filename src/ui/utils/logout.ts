import { feedback } from '@/src/ui/lib/feedback';

export async function logout() {
    try {
        // ✅ Fazer requisição ao backend para limpar o cookie HttpOnly
        const res = await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // Incluir cookies
        });

        if (!res.ok) {
            throw new Error('Erro ao fazer logout');
        }

        // ✅ Limpar cache/estado do cliente
        feedback.dismiss();
        feedback.success("Deslogado!")
        
        // Redirecionar para login (será feito no middleware)
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout error:', error);
        feedback.error("Erro ao fazer logout");
    }
}