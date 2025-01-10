import { MapsInjectableDependencies } from "../config/maps-di";
import { MapsRepository } from "../repositories/maps-repository";
import { CREATE_MAP_SCHEMA_TYPE, CreateMapDTO } from "../schemas";
import { Map } from "../schemas";

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Map> {
    return await this.mapsRepository.createMap(createMapDto);
  }
}
