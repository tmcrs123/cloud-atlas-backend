import { CustomError } from './custom-error.js'

export class MissingConfigError extends CustomError {
  constructor(message: string, statusCode: number) {
    super(message, 'MISSING_CONFIG_ERROR', statusCode)

    Object.setPrototypeOf(this, MissingConfigError.prototype)
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }]
  }
}
