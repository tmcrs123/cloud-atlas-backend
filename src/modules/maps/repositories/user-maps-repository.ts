import { Map, MapOwnership } from "../schemas/index.js";

export interface UserMapsRepository {
  getMapsByUserId(userId: string): Promise<Map[]>;
  createMapOwnership(owner: string, mapId: string): Promise<MapOwnership>;
  deleteMapOwnership(userId: string, mapId: string): Promise<void>;
}
