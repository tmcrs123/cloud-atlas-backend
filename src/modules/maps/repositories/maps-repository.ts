import { SnappinMap, CreateMapDTO, UpdateMapDTO } from "../schemas/index.js";
import { DynamoDbMapsRepository } from "./dynamodb-maps-repository.js";
import { PostgresMapsRepository } from "./postgres-maps-repository.js";

export interface MapsRepository {
  createMap(createMapDto: CreateMapDTO): Promise<Partial<SnappinMap>>;
  getMap(id: string): Promise<Partial<SnappinMap> | null>;
  deleteMap(id: string): Promise<void>;
  updateMap(
    id: string,
    updatedData: UpdateMapDTO
  ): Promise<Partial<SnappinMap> | null>;
}
