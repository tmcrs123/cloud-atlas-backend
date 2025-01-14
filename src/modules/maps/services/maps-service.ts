import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import { CreateMapDTO, SnappinMap, UpdateMapDTO } from "../schemas/index.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Partial<SnappinMap>> {
    return await this.mapsRepository.createMap(createMapDto);
  }

  async getMap(id: string): Promise<Partial<SnappinMap> | null> {
    const response = await this.mapsRepository.getMap(id);
    if (!response) return null;
    return response;
  }

  async deleteMap(id: string): Promise<void> {
    return await this.mapsRepository.deleteMap(id);
  }

  async updateMap(
    id: string,
    updatedData: UpdateMapDTO
  ): Promise<Partial<SnappinMap> | null> {
    return await this.mapsRepository.updateMap(id, updatedData);
  }
}
