export interface ImagesURLsService {
  getPreSignedUrl(mapId: string, markerId: string): Promise<void>;
}
