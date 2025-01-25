import { MapsRepository } from "./maps-repository.js";
import { Map, UpdateMapDTO } from "../schemas/index.js";

export class PostgresMapsRepository implements MapsRepository {
  async createMap(): Promise<Map> {
    return new Promise((resolve) =>
      resolve({
        createdAt: "",
        mapId: "123",
        markersCount: 12,
        title: "Postgres repo maps",
        claims: ["EDIT"],
        coverPhoto: "",
      })
    );
  }

  async getMapsDetails(): Promise<Map> {
    return new Promise((resolve) => resolve({} as Map));
  }

  deleteMap(id: string): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  updateMap(
    updatedData: UpdateMapDTO,
    id: string
  ): Promise<Partial<Map> | null> {
    return new Promise((resolve) => {
      resolve(null);
    });
  }
}
