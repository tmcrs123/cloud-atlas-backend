import { randomUUID } from "crypto";
import { stripProperties } from "../../../utils/index.js";
import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import { Map } from "../schemas/index.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(title: string, owner: string): Promise<Partial<Map>> {
    const map = await this.mapsRepository.createMap({
      claims: ["EDIT"],
      title,
      mapId: randomUUID(),
      createdAt: new Date().toUTCString(),
      markersCount: 0,
      owner,
    });

    return stripProperties<Partial<Map>>({ ...map }, ["owner"]);
  }

  async getMap(mapId: string): Promise<Partial<Map> | null> {
    const response = await this.mapsRepository.getMap(mapId);
    if (!response) return null;

    return stripProperties<Partial<Map>>(response, ["owner"]);
  }

  async deleteMap(mapId: string): Promise<void> {
    await this.mapsRepository.deleteMap(mapId);
  }

  async updateMap(
    updatedData: Partial<Map>,
    mapId: string
  ): Promise<Partial<Map> | null> {
    const updatedMap = await this.mapsRepository.updateMap(
      { ...updatedData, updatedAt: new Date().toUTCString() },
      mapId
    );
    if (!updatedMap) return null;

    return stripProperties<Partial<Map>>(updatedMap, ["owner"]);
  }
}
