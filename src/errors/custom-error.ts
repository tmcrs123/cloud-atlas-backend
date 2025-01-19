export abstract class CustomError extends Error {
  error: string;
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(message: string, error: string, statusCode: number) {
    super(message);
    this.error = error;
    this.statusCode = statusCode;
  }
}
