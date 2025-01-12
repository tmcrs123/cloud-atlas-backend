import { MapsInjectableDependencies } from "../config/maps-config";
import { MapsRepository } from "../repositories/maps-repository";
import { CREATE_SNAPPIN_SCHEMA_TYPE, CreateMapDTO } from "../schemas";
import { SnappinMap } from "../schemas";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(createMapDto: CreateMapDTO): Promise<SnappinMap> {
    return await this.mapsRepository.createMap(createMapDto);
  }
}
