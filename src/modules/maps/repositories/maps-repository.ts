import { SnappinMap, CreateMapDTO } from "../schemas/index.js";
import { DynamoDbMapsRepository } from "./dynamodb-maps-repository.js";
import { PostgresMapsRepository } from "./postgres-maps-repository.js";

export interface MapsRepository {
  createMap(createMapDto: CreateMapDTO): Promise<SnappinMap>;
}

// the new() => MapsRepo simply means that values returned are construtor functions
export const dbEngines: Record<string, new () => MapsRepository> = {
  dynamoDb: DynamoDbMapsRepository,
  postgres: PostgresMapsRepository,
};
