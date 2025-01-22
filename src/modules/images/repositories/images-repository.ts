export interface ImagesRepository {
  getImagesForMarker(mapId: string, markerId: string): Promise<any[]>;
  getImagesForMap(mapId: string): Promise<any[]>;
  saveImagesDetails(mapId: string, markerId: string, imageId: string): void;
  deleteImageFromMarker(mapId: string, markerId: string, imageId: string): void;
  deleteAllImagesForMap(imageIds: string[], mapId: string): Promise<void>;
}
