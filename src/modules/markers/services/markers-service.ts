import { randomUUID } from "crypto";
import { MarkersInjectableDependencies } from "../config/index.js";
import { MarkersRepository } from "../repositories/index.js";
import {
  CreateMarkerDTO,
  CreateMarkersRequestBody,
  Marker,
} from "../schemas/markers-schema.js";

export class MarkersService {
  private readonly markersRepository: MarkersRepository;

  constructor({ markersRepository }: MarkersInjectableDependencies) {
    this.markersRepository = markersRepository;
  }

  async createMarkers(
    request: Partial<Marker>[],
    mapId: string
  ): Promise<Marker[]> {
    const dtos: CreateMarkerDTO[] = request.map((marker) => ({
      ...marker,
      mapId,
      imageCount: 0,
      markerId: randomUUID(),
      createdAt: new Date().toUTCString(),
      coordinates: marker.coordinates!,
    }));

    return await this.markersRepository.createMarkers(dtos);
  }

  async getMarker(mapId: string, markerId: string): Promise<Marker | null> {
    const marker = await this.markersRepository.getMarker(mapId, markerId);
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

  async deleteMarkers(
    markerIds: string[],
    mapId: string,
    deleteAll = false
  ): Promise<void> {
    let markerIdsToDelete = markerIds;

    if (deleteAll) {
      const allMarkers = await this.getMarkers(mapId);
      if (!allMarkers) return;
      markerIdsToDelete = allMarkers.map((m) => m.markerId);
    }

    return await this.markersRepository.deleteMarkers(markerIdsToDelete, mapId);
  }

  async updateMarker(
    markerId: string,
    mapId: string,
    updatedData: Partial<Marker>
  ): Promise<Marker> {
    return await this.markersRepository.updateMarker(markerId, mapId, {
      ...updatedData,
      updatedAt: new Date().toUTCString(),
    });
  }
}
