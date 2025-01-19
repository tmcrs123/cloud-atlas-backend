import { CustomError } from "./custom-error.js";

export default class RequestValidationError extends CustomError {
  constructor() {
    super("Invalid request parameters", "REQUEST_PARAMETERS_ERROR", 400);

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
