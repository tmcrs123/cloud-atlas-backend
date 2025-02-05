export interface ImagesURLsService {
  getPreSignedUrl(atlasId: string, markerId: string): Promise<{ url: string; fields: Record<string, string> }>
  getUrlForExistingImage(atlasId: string, markerId: string, imageId: string): Promise<string>
}
