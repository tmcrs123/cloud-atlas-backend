import { CustomError } from "./custom-error";

export default class InternalError extends CustomError {
  httpStatusCode: number = 500;
  errorMessage: string = "Unknown error";

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.errorMessage }];
  }
}
