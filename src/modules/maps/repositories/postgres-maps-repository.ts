import { MapsRepository } from "./maps-repository";
import { Map } from "../schemas";

export class PostgresMapsRepository implements MapsRepository {
  async createMap(): Promise<Map> {
    return new Promise((resolve) =>
      resolve({
        createdAt: "",
        id: "123",
        markersCount: 12,
        title: "Postgres repo maps",
      })
    );
  }
}
