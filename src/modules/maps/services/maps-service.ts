import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import { CreateMapDTO, SnappinMap } from "../schemas/index.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(createMapDto: CreateMapDTO): Promise<SnappinMap> {
    return await this.mapsRepository.createMap(createMapDto);
  }

  async getMap(id: string): Promise<SnappinMap> {
    return await this.mapsRepository.getMap(id);
  }

  async deleteMap(id: string): Promise<void> {
    return await this.mapsRepository.deleteMap(id);
  }
}
