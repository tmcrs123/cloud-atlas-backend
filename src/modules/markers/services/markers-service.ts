import { randomUUID } from 'node:crypto'
import type { MarkersInjectableDependencies } from '../config/markers-config.js'
import type { MarkersRepository } from '../repositories/markers-repository.js'
import type { Marker, CreateMarkerDTO } from '../schemas/markers-schema.js'

export class MarkersService {
  private readonly markersRepository: MarkersRepository

  constructor({ markersRepository }: MarkersInjectableDependencies) {
    this.markersRepository = markersRepository
  }

  async createMarkers(request: Partial<Marker>[], atlasId: string): Promise<Marker[]> {
    const dtos: CreateMarkerDTO[] = request.map((marker) => ({
      ...marker,
      atlasId,
      imageCount: 0,
      markerId: randomUUID(),
      createdAt: new Date().toUTCString(),
      coordinates: marker.coordinates!,
    }))

    return await this.markersRepository.createMarkers(dtos)
  }

  async getMarker(atlasId: string, markerId: string): Promise<Marker> {
    const marker = await this.markersRepository.getMarker(atlasId, markerId)
    return marker
  }

  async getMarkers(atlasId: string): Promise<Marker[]> {
    const markers = await this.markersRepository.getMarkers(atlasId)
    return markers
  }

  async deleteMarker(markerId: string, atlasId: string): Promise<void> {
    return await this.markersRepository.deleteMarker(markerId, atlasId)
  }

  async deleteMarkers(markerIds: string[], atlasId: string, deleteAll = false): Promise<void> {
    let markerIdsToDelete = markerIds

    if (deleteAll) {
      const allMarkers = await this.getMarkers(atlasId)
      if (!allMarkers) return
      markerIdsToDelete = allMarkers.map((m) => m.markerId)
    }

    return await this.markersRepository.deleteMarkers(markerIdsToDelete, atlasId)
  }

  async updateMarker(markerId: string, atlasId: string, updatedData: Partial<Marker>): Promise<Marker> {
    return await this.markersRepository.updateMarker(markerId, atlasId, {
      ...updatedData,
      updatedAt: new Date().toUTCString(),
    })
  }
}
