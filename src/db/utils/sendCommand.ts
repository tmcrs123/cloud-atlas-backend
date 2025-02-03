import { DatabaseGenericError } from "../../errors/index.js";
import { DynamoDbError } from "../types/index.js";

export async function sendCommand<T>(sendFn: () => Promise<T>): Promise<T> {
  try {
    return await sendFn();
  } catch (err) {
    let error = err as DynamoDbError;
    throw new DatabaseGenericError(
      error.message,
      error.$metadata?.httpStatusCode || 500
    );
  }
}
