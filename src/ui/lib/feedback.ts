import { AppError } from "@/src/ui/services/errors/app-error";
import { toast } from "sonner";

export const feedback = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (error: any) => {
    let message = "Ocorreu um erro inesperado";

    // Se for a sua classe de erro personalizada
    if (error instanceof AppError) {
      message = error.message;
    }
    // Se for erro do Axios direto
    else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }
    // Fallback para erro genérico
    else if (error?.message || error?.trim()) {
      message = error.message ?? error;
    }

    toast.error(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (id?: string | number) => {
    toast.dismiss(id);
  },
};