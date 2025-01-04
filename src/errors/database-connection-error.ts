import { CustomError } from "./custom-error";

export default class DatabaseConnetionError extends CustomError {
  httpStatusCode: number = 500;
  errorMessage: string = "Error connecting to the database";

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.errorMessage }];
  }
}
