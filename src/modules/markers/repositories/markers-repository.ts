import {
  CreateSnappinMarkerDTO,
  SnappinMarker,
} from "../schemas/markers-schema.js";

export interface MarkersRepository {
  createManyMarkers(createMarkerDTOs: CreateSnappinMarkerDTO[]): Promise<void>;
  createMarker(
    createMarkerDTO: CreateSnappinMarkerDTO
  ): Promise<Partial<SnappinMarker>>;
  getMarker(id: string): Promise<Partial<SnappinMarker> | null>;
  deleteMarker(id: string): Promise<void>;
}
