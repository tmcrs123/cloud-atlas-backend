import {
  CreateMarkerDTO,
  Marker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";

export interface MarkersRepository {
  createMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<Marker[]>;
  getMarker(mapId: string, markerId: string): Promise<Marker | null>;
  getMarkers(mapId: string): Promise<Marker[] | null>;
  deleteMarker(markerId: string, mapId: string): Promise<void>;
  deleteMarkers(markerIds: string[], mapId: string): Promise<void>;
  updateMarker(
    markerId: string,
    mapId: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Marker>;
  updateImageCount(mapId: string, markerId: string): Promise<void>;
}
