export interface ImagesRepository {
  getImagesForMarker(markerId: string): Promise<void | null>;
  saveImagesDetails(mapId: string, markerId: string, imageId: string): void;
  deleteImageFromMarker(mapId: string, markerId: string, imageId: string): void;
}
