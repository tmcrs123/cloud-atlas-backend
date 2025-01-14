import { randomUUID } from "crypto";
import { MarkersInjectableDependencies } from "../config/index.js";
import { MarkersRepository } from "../repositories/index.js";
import {
  CreateSnappinMarkerDTO,
  CreateSnappinMarkerRequestBody,
  SnappinMarker,
} from "../schemas/markers-schema.js";

export class MarkersService {
  private readonly markersRepository: MarkersRepository;

  constructor({ markersRepository }: MarkersInjectableDependencies) {
    this.markersRepository = markersRepository;
  }

  async createMarker(
    createMarkerDto: CreateSnappinMarkerDTO
  ): Promise<Partial<SnappinMarker>> {
    return await this.markersRepository.createMarker(createMarkerDto);
  }

  async createManyMarkers(
    request: CreateSnappinMarkerRequestBody[]
  ): Promise<void> {
    const dtos: CreateSnappinMarkerDTO[] = request.map((marker) => ({
      ...marker,
      imageCount: 0,
      id: randomUUID(),
      createdAt: new Date().toUTCString(),
    }));

    await this.markersRepository.createManyMarkers(dtos);
  }

  async getMarker(id: string): Promise<Partial<SnappinMarker> | null> {
    const marker = await this.markersRepository.getMarker(id);
    if (!marker) return null;
    return marker;
  }

  async deleteMarker(id: string): Promise<void> {
    return await this.markersRepository.deleteMarker(id);
  }
}
