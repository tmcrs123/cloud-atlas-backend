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
  ): Promise<Marker> {
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
  ): Promise<Marker[]> {
    const dtos: CreateMarkerDTO[] = request.map((marker) => ({
      ...marker,
      mapId,
      imageCount: 0,
      markerId: randomUUID(),
      createdAt: new Date().toUTCString(),
      coordinates: marker.coordinates,
    }));

    return await this.markersRepository.createManyMarkers(dtos);
  }

  async getMarker(id: string): Promise<Partial<Marker> | null> {
    const marker = await this.markersRepository.getMarker(id);
    if (!marker) return null;
    return marker;
  }

  async getMarkers(mapId: string): Promise<Marker[] | null> {
    const markers = this.markersRepository.getMarkers(mapId);
    if (!markers) return null;
    return markers;
  }

  async deleteMarker(markerId: string, mapId: string): Promise<void> {
    return await this.markersRepository.deleteMarker(markerId, mapId);
  }

  async deleteManyMarkers(markerIds: string[], mapId: string): Promise<void> {
    return await this.markersRepository.deleteManyMarkers(markerIds, mapId);
  }

  async updateMarker(
    markerId: string,
    mapId: string,
    updatedData: Partial<Marker>
  ): Promise<Partial<Marker> | null> {
    return await this.markersRepository.updateMarker(markerId, mapId, {
      ...updatedData,
      updatedAt: new Date().toUTCString(),
    });
  }
}
