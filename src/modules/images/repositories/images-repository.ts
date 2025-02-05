import type { Image, CreateImageDTO, UpdateImageDTO } from '../schemas/images-schema.js'

export interface ImagesRepository {
  getImagesForMarker(atlasId: string, markerId: string): Promise<Image[]>
  getImagesForAtlas(atlasId: string): Promise<Image[]>
  createImage(createImageDTO: CreateImageDTO): Promise<Image>
  updateImage(updatedData: UpdateImageDTO, atlasId: string, imageId: string): Promise<Image>
  deleteImages(atlasId: string, imageIds: string[]): Promise<void>
}
