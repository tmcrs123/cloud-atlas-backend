import { randomUUID } from "crypto";
import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import { UserMapsRepository } from "../repositories/user-maps-repository.js";
import { Map } from "../schemas/index.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;
  private readonly userMapsRepository: UserMapsRepository;

  constructor({
    mapsRepository,
    userMapsRepository,
  }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
    this.userMapsRepository = userMapsRepository;
  }

  async createMap(title: string, owner: string): Promise<Partial<Map>> {
    const mapId = randomUUID();
    const map = await this.mapsRepository.createMap({
      claims: ["EDIT"],
      title,
      mapId,
      createdAt: new Date().toUTCString(),
      markersCount: 0,
      owner,
    });

    await this.userMapsRepository.createMapOwnership(owner, mapId);

    return map;
  }

  async getMapsByOwner(owner: string): Promise<Map[]> {
    const availableMaps = await this.userMapsRepository.getMapsByUserId(owner);
    return await this.populateMapsDetails(availableMaps.map((m) => m.mapId));
  }

  async getMapsDetails(mapIds: string[]): Promise<Map[]> {
    const response = await this.populateMapsDetails(mapIds);
    return response;
  }

  private async populateMapsDetails(mapIds: string[]): Promise<Map[]> {
    const response = await this.mapsRepository.getMapsDetails(mapIds);
    return response;
  }

  async deleteMap(userId: string, mapId: string): Promise<void> {
    await this.mapsRepository.deleteMap(mapId);
    await this.userMapsRepository.deleteMapOwnership(userId, mapId);
  }

  async updateMap(
    updatedData: Partial<Map>,
    mapId: string
  ): Promise<Partial<Map>> {
    const updatedMap = await this.mapsRepository.updateMap(
      { ...updatedData, updatedAt: new Date().toUTCString() },
      mapId
    );

    return updatedMap;
  }
}
