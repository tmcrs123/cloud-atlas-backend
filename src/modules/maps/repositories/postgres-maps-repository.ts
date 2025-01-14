import { MapsRepository } from "./maps-repository.js";
import { SnappinMap, UpdateMapDTO } from "../schemas/index.js";

export class PostgresMapsRepository implements MapsRepository {
  async createMap(): Promise<SnappinMap> {
    return new Promise((resolve) =>
      resolve({
        createdAt: "",
        id: "123",
        markersCount: 12,
        title: "Postgres repo maps",
        claims: ["EDIT"],
        coverPhoto: "",
      })
    );
  }

  async getMap(): Promise<SnappinMap> {
    return new Promise((resolve) => resolve({} as SnappinMap));
  }

  deleteMap(id: string): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  updateMap(id: string, updatedData: UpdateMapDTO): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }
}
