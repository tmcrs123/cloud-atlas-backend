import { CustomError } from "./custom-error";

export default class NotFoundError extends CustomError {
  httpStatusCode: number = 404;
  errorMessage: string = "Entity not found";

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.errorMessage }];
  }
}
