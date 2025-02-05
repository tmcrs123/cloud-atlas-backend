import type { CreateMarkerDTO, Marker, UpdateMarkerDTO } from '../schemas/markers-schema.js'

export interface MarkersRepository {
  createMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<Marker[]>
  getMarker(atlasId: string, markerId: string): Promise<Marker>
  getMarkers(atlasId: string): Promise<Marker[]>
  deleteMarker(markerId: string, atlasId: string): Promise<void>
  deleteMarkers(markerIds: string[], atlasId: string): Promise<void>
  updateMarker(markerId: string, atlasId: string, updatedData: UpdateMarkerDTO): Promise<Marker>
  updateImageCount(atlasId: string, markerId: string): Promise<void>
}
