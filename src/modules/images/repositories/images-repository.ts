export interface ImagesRepository {
  getImagesForMarker(id: string): Promise<void | null>;
  saveImagesDetails(mapId: string, markerId: string, imageId: string): void;
  deleteImageFromMarker(markerId: string, imageId: string): void;
}
