import { Map, CreateMapDTO, UpdateMapDTO } from "../schemas/index.js";
import { DynamoDbMapsRepository } from "./dynamodb-maps-repository.js";
import { PostgresMapsRepository } from "./postgres-maps-repository.js";

export interface MapsRepository {
  createMap(createMapDto: CreateMapDTO): Promise<Partial<Map>>;
  getMap(id: string): Promise<Partial<Map> | null>;
  deleteMap(id: string): Promise<void>;
  updateMap(
    updatedData: UpdateMapDTO,
    id: string
  ): Promise<Partial<Map> | null>;
}
