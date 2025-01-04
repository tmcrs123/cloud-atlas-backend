import { CustomError } from "./custom-error";

export default class NotAuthorizedError extends CustomError {
  httpStatusCode: number = 401;
  errorMessage: string = "Not Authorized";

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.errorMessage }];
  }
}
