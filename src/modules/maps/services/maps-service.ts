import { randomUUID } from "crypto";
import { stripProperties } from "../../../utils/index.js";
import { MapsInjectableDependencies } from "../config/index.js";
import { MapsRepository } from "../repositories/index.js";
import {
  CreateMapRequestBody,
  Map,
  UpdateMapRequestBody,
} from "../schemas/index.js";
import { MarkersService } from "../../markers/services/markers-service.js";
import { ImagesService } from "../../images/services/images-service.js";

export class MapsService {
  private readonly mapsRepository: MapsRepository;
  private readonly markersService: MarkersService;
  private readonly imagesService: ImagesService;

  constructor({
    mapsRepository,
    markersService,
    imagesService,
  }: MapsInjectableDependencies) {
    this.mapsRepository = mapsRepository;
    this.markersService = markersService;
    this.imagesService = imagesService;
  }

  async createMap(
    request: CreateMapRequestBody,
    owner: string
  ): Promise<Partial<Map>> {
    const map = await this.mapsRepository.createMap({
      claims: ["EDIT"],
      title: request.title,
      mapId: randomUUID(),
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

  async deleteMap(mapId: string): Promise<void> {
    await this.mapsRepository.deleteMap(mapId);

    //delete markers
    const markers = await this.markersService.getMarkersForMap(mapId);
    const images = await this.imagesService.getImagesForMap(mapId);

    const markerIds = markers?.map((marker) => marker.markerId);

    if (!markerIds) return;

    await this.markersService.deleteManyMarkers(markerIds, mapId);

    this.imagesService.deleteAllImagesForMap(images, mapId);
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
