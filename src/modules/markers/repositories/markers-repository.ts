import {
  CreateMarkerDTO,
  Marker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";

export interface MarkersRepository {
  createManyMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<void>;
  createMarker(createMarkerDTO: CreateMarkerDTO): Promise<void>;
  getMarker(markerId: string): Promise<Partial<Marker> | null>;
  getMarkersForMap(mapId: string): Promise<Marker[] | null>;
  deleteMarker(markerId: string, mapId: string): Promise<void>;
  deleteManyMarkers(markerIds: string[], mapId: string): Promise<void>;
  updateMarker(
    markerId: string,
    mapId: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<Marker> | null>;
  updateImageCount(markerId: string, mapId: string): Promise<void>;
}
