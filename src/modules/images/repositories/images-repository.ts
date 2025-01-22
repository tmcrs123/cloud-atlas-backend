import { Image } from "../schemas/index.js";

export interface ImagesRepository {
  getImagesForMarker(mapId: string, markerId: string): Promise<Image[] | null>;
  getImagesForMap(mapId: string): Promise<Image[] | null>;
  saveImagesDetails(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void>;
  deleteImageFromMarker(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void>;
  deleteAllImagesForMap(imageIds: string[], mapId: string): Promise<void>;
  deleteAllImagesForMarker(markerId: string, mapId: string): Promise<void>;
}
