import { CustomError } from "./custom-error";

export default class RequestValidationError extends CustomError {
  httpStatusCode: number = 400;
  errorMessage: string = "Invalid request parameters";

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.errorMessage }];
  }
}
