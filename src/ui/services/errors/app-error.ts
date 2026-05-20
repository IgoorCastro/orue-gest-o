export class AppError extends Error {
  public statusCode?: number;
  public originalError?: unknown;

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}