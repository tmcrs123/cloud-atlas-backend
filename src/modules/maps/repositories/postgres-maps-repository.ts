import { MapsRepository } from "./maps-repository";
import { SnappinMap } from "../schemas";

export class PostgresMapsRepository implements MapsRepository {
  async createMap(): Promise<SnappinMap> {
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
