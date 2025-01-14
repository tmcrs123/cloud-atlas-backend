import {
  CreateSnappinMarkerDTO,
  SnappinMarker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";

export interface MarkersRepository {
  createManyMarkers(createMarkerDTOs: CreateSnappinMarkerDTO[]): Promise<void>;
  createMarker(
    createMarkerDTO: CreateSnappinMarkerDTO
  ): Promise<Partial<SnappinMarker>>;
  getMarker(id: string): Promise<Partial<SnappinMarker> | null>;
  deleteMarker(id: string): Promise<void>;
  updateMarker(
    id: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<SnappinMarker> | null>;
}
