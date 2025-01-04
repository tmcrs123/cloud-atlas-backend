import { DynamoDbMapsRepository } from "./dynamodb-maps-repository";
import { PostgresMapsRepository } from "./postgres-maps-repository";

export interface MapsRepository {
  createMap(): Promise<string>;
}

// the new() => MapsRepo simply means that values returned are construtor functions
export const dbEngines: Record<string, new () => MapsRepository> = {
  dynamoDb: DynamoDbMapsRepository,
  postgres: PostgresMapsRepository
};
