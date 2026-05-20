"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Lock, User, Loader2 } from "lucide-react";
import { Button } from "@/src/ui/components/ui/button";
import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/ui/components/ui/card";
import { feedback } from "@/src/ui/lib/feedback";

export default function LoginPage() {
    const router = useRouter();
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        
        setIsLoading(true);
        setError(null);

        try {
            // ✅ Usar URL relativa (o Next.js vai rotear para o backend)
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Incluir cookies na requisição
                body: JSON.stringify({ nickname, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Token já está em HttpOnly cookie (seguro!)
                feedback.success("Bem-vindo!");
                router.push("/"); // Redirecionará baseado na role
            } else {
                feedback.error(data.error || "Erro no login");
                setError(data.error);
            }
        } catch (err) {
            feedback.error("Erro ao conectar ao servidor");
            setError("Erro ao conectar ao servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
                            <LayoutDashboard className="h-8 w-8 text-sky-600 dark:text-sky-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        Acesso ao Sistema
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Digite suas credenciais para gerenciar o estoque
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Usuário</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="nickname"
                                    placeholder="Seu nickname"
                                    className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-6"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Autenticando...
                                </>
                            ) : (
                                "Entrar no Sistema"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}