

import { ReactNode } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../ui/alert-dialog";

interface ConfirmModalProps {
    children: ReactNode;
    title: string;
    description?: string;
    onConfirm?: () => void; // Tornei opcional pois o submit do form pode lidar com isso
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    formId?: string; // Prop mágica para torná-lo compatível com Forms
}

export function ConfirmModal({
    children,
    title,
    description,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "default",
    formId,
}: ConfirmModalProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel variant="default" size="default"> {cancelText} </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            onConfirm && onConfirm();
                            e.stopPropagation();
                        }}
                        // se existir formId, vira submit. Se não, vira button comum.
                        type={formId ? "submit" : "button"}
                        size="default"
                        variant="default"
                        // conecta o botão ao formulário mesmo estando fora da tag <form>
                        form={formId}
                        className={
                            variant === "destructive"
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : ""
                        }
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}