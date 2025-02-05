import { CustomError } from './custom-error.js'

export class DatabaseConnectionError extends CustomError {
  constructor() {
    super('Error connecting to the database', 'DATABASE_CONNECTION_ERROR', 500)

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: this.message }]
  }
}
