import { DatabaseGenericError } from '../../errors/database-generic-error.js'
import type { DynamoDbError } from '../types/db-types.js'

export async function sendCommand<T>(sendFn: () => Promise<T>): Promise<T> {
  try {
    return await sendFn()
  } catch (err) {
    const error = err as DynamoDbError
    throw new DatabaseGenericError(error.message, error.$metadata?.httpStatusCode || 500)
  }
}
