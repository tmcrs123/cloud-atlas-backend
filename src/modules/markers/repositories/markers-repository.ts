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
  deleteMarker(id: string): Promise<void>;
  updateMarker(
    id: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<Marker> | null>;
}
