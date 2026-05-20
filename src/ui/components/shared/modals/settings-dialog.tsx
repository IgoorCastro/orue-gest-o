
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/ui/components/ui/dialog";
import { Label } from "@/src/ui/components/ui/label";
import { Separator } from "@/src/ui/components/ui/separator";
import { HelpCircle, LogOut, Settings } from "lucide-react";
import { logout } from "@//src/ui/utils/logout";
import { useRouter } from "next/navigation";

export default function SettingsDialog() {
    const router = useRouter()
    const userLogout = () => {
        logout();
        router.push("/login")
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                {/* ícone de settings que será clicado na Sidebar */}
                <Settings className="cursor-pointer hover:text-primary transition-colors" size={23} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Configurações</DialogTitle>
                    <DialogDescription>
                        Gerencie suas preferências de conta e suporte.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="flex flex-col gap-2 py-2">
                    {/* Item: Ajuda */}
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                        <HelpCircle size={24} className="text-muted-foreground group-hover:text-primary" />
                        <div className="flex flex-col">
                            <Label className="text-base cursor-pointer">Ajuda</Label>
                            <span className="text-xs text-muted-foreground">Central de suporte e FAQ</span>
                        </div>
                    </div>

                    {/* Item: Sair */}
                    <div
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-destructive/10 cursor-pointer transition-colors group"
                        onClick={() => userLogout()}
                    >
                        <LogOut size={24} className="text-muted-foreground group-hover:text-destructive" />
                        <div className="flex flex-col">
                            <Label className="text-base cursor-pointer group-hover:text-destructive">Sair</Label>
                            <span className="text-xs text-muted-foreground">Encerrar sua sessão atual</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}