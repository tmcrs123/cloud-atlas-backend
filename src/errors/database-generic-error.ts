import { CustomError } from "./custom-error.js";

export class DatabaseGenericError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message, "DATABASE_ERROR", statusCode);

    Object.setPrototypeOf(this, DatabaseGenericError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
