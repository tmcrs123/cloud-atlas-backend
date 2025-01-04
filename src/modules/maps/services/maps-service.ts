import { MapsInjectableDependencies } from "../config/maps-di";
import { MapsRepository } from "../repositories/maps-repository";
import { CREATE_MAP_SCHEMA_TYPE } from "../schemas";

type CreateMapDTO = CREATE_MAP_SCHEMA_TYPE;

export class MapsService {
  private readonly mapsRepository: MapsRepository;

  constructor({ mapsRepository }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
  }

  async createMap(map: CreateMapDTO) {
    //repository
    const test = await this.mapsRepository.createMap()
    return test;
  }
}
