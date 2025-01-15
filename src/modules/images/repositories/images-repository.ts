export interface ImagesRepository {
  getImagesForMarker(id: string): Promise<void | null>;
}
