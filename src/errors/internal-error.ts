import { CustomError } from "./custom-error.js";

export default class InternalError extends CustomError {
  constructor(message: string, error: string) {
    super(message, error, 500);

    Object.setPrototypeOf(this, InternalError);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }];
  }
}
