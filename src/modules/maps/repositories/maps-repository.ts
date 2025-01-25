import { CreateMapDTO, Map, UpdateMapDTO } from "../schemas/index.js";

export interface MapsRepository {
  createMap(createMapDto: CreateMapDTO): Promise<Partial<Map>>;
  getMapsDetails(mapIds: string[]): Promise<Map[] | null>;
  deleteMap(id: string): Promise<void>;
  updateMap(
    updatedData: UpdateMapDTO,
    id: string
  ): Promise<Partial<Map> | null>;
}
