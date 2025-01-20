import { randomUUID } from "crypto";
import { MarkersInjectableDependencies } from "../config/index.js";
import { MarkersRepository } from "../repositories/index.js";
import {
  CreateMarkerDTO,
  CreateMarkerRequestBody,
  Marker,
  UpdateMarkerRequestBody,
} from "../schemas/markers-schema.js";

export class MarkersService {
  private readonly markersRepository: MarkersRepository;

  constructor({ markersRepository }: MarkersInjectableDependencies) {
    this.markersRepository = markersRepository;
  }

  async createMarker(
    request: CreateMarkerRequestBody,
    mapId: string
  ): Promise<Partial<Marker>> {
    const dto = {
      createdAt: new Date().toUTCString(),
      imageCount: 0,
      coordinates: request.coordinates,
      mapId,
      markerId: randomUUID(),
    };
    await this.markersRepository.createMarker(dto);

    return dto;
  }

  async createManyMarkers(
    request: CreateMarkerRequestBody[],
    mapId: string
  ): Promise<Partial<Marker>[]> {
    const dtos: CreateMarkerDTO[] = request.map((marker) => ({
      ...marker,
      mapId,
      imageCount: 0,
      markerId: randomUUID(),
      createdAt: new Date().toUTCString(),
    }));

    await this.markersRepository.createManyMarkers(dtos);

    return [...dtos];
  }

  async getMarker(id: string): Promise<Partial<Marker> | null> {
    const marker = await this.markersRepository.getMarker(id);
    if (!marker) return null;
    return marker;
  }

  async getMarkersForMap(mapId: string): Promise<Marker[] | null> {
    const markers = this.markersRepository.getMarkersForMap(mapId);
    if (!markers) return null;
    return markers;
  }

  async deleteMarker(id: string, mapId: string): Promise<void> {
    return await this.markersRepository.deleteMarker(id, mapId);
  }

  async updateMarker(
    markerId: string,
    mapId: string,
    updatedData: UpdateMarkerRequestBody
  ): Promise<Partial<Marker> | null> {
    return await this.markersRepository.updateMarker(markerId, mapId, {
      ...updatedData,
      updatedAt: new Date().toUTCString(),
    });
  }
}
