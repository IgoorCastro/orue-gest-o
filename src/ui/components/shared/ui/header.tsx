'use client'

import { Clock, ShieldCheck, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { useUser } from "@/src/ui/contexts/user-context";

type HeaderProps = {
    title?: string;
    description?: string;
}

export default function UserHeader({title, description}: HeaderProps) {
    const [time, setTime] = useState(new Date());
    const user = useUser();

    // Hook para o relógio em tempo real
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* Header de Boas-vindas e Informações do Usuário */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>

                <Card className="bg-muted/30 border-none shadow-none">
                    <CardContent className="flex items-center gap-6 py-3 px-6">
                        {/* Relógio em Tempo Real */}
                        <div className="flex items-center gap-2 border-r pr-6">
                            <Clock className="h-5 w-5 text-green-500" />
                            {/* utilizar suppressHydrationWarning para evitar erro de hydration */}
                            <span className="text-lg font-mono font-bold tracking-widest" suppressHydrationWarning>
                                {time.toLocaleTimeString("pt-BR")}
                            </span>
                        </div>

                        {/* Perfil do Usuário */}
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-bold leading-none">{user?.name}</span>
                                <span className="text-[10px] font-medium uppercase tracking-tighter text-muted-foreground flex items-center justify-end gap-1">
                                    {user?.role === "ADMIN" && <ShieldCheck className="h-3 w-3 text-blue-500" />}
                                    {user?.role}
                                </span>
                            </div>
                            <UserCircle className="h-10 w-10 text-foreground/20" />
                        </div>
                    </CardContent>
                </Card>
            </header>
        </>
    )
}