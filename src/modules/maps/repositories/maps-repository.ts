import { CreateMapDTO, Map, UpdateMapDTO } from "../schemas/index.js";

export interface MapsRepository {
  createMap(createMapDto: CreateMapDTO): Promise<Partial<Map>>;
  getMap(id: string): Promise<Partial<Map> | null>;
  deleteMap(id: string): Promise<void>;
  updateMap(
    updatedData: UpdateMapDTO,
    id: string
  ): Promise<Partial<Map> | null>;
}
