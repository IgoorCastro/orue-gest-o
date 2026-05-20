import axios from "axios";
import { AppError } from "./app-error";

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Erro na requisição";

    throw new AppError(message, status, error);
  }

  throw new AppError("Erro inesperado", undefined, error);
}