import {
  CreateMarkerDTO,
  Marker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";

export interface MarkersRepository {
  createManyMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<void>;
  createMarker(createMarkerDTO: CreateMarkerDTO): Promise<void>;
  getMarker(id: string): Promise<Partial<Marker> | null>;
  getMarkersForMap(mapId: string): Promise<Marker[] | null>;
  deleteMarker(markerId: string, mapId: string): Promise<void>;
  updateMarker(
    id: string,
    mapId: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<Marker> | null>;
  updateImageCount(markerId: string, mapId: string): Promise<void>;
}
