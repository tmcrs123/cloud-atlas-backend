import { randomUUID } from "crypto";
import { stripProperties } from "../../../utils/index.js";
import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import {
  CreateMapRequestBody,
  Map,
  UpdateMapRequestBody,
} from "../schemas/index.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(
    request: CreateMapRequestBody,
    owner: string
  ): Promise<Partial<Map>> {
    const map = await this.mapsRepository.createMap({
      claims: ["EDIT"],
      title: request.title,
      id: randomUUID(),
      createdAt: new Date().toUTCString(),
      markersCount: 0,
      owner,
    });
    return stripProperties<Partial<Map>>({ ...map }, ["owner"]);
  }

  async getMap(id: string): Promise<Partial<Map> | null> {
    const response = await this.mapsRepository.getMap(id);
    if (!response) return null;

    return stripProperties<Partial<Map>>(response, ["owner"]);
  }

  async deleteMap(id: string): Promise<void> {
    return await this.mapsRepository.deleteMap(id);
  }

  async updateMap(
    updatedData: UpdateMapRequestBody,
    id: string
  ): Promise<Partial<Map> | null> {
    const updatedMap = await this.mapsRepository.updateMap(
      { ...updatedData, updatedAt: new Date().toUTCString() },
      id
    );
    if (!updatedMap) return null;

    return stripProperties<Partial<Map>>(updatedMap, ["owner"]);
  }
}
