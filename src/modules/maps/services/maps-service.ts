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
}
