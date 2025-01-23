export interface ImagesURLsService {
  getPreSignedUrl(
    mapId: string,
    markerId: string
  ): Promise<{ url: string; fields: Record<string, string> }>;
  getUrlForExistingImage(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<string>;
}
