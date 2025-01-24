import { Map } from "../schemas/index.js";

export interface UserMapsRepository {
  getMapsByUserId(userId: string): Promise<Map[] | null>;
}
