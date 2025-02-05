import type { AppMessage } from '../../../shared/types/common-types.js'
import type { MarkersRepository } from '../../markers/repositories/markers-repository.js'
import type { ImagesInjectableDependencies } from '../config/images-config.js'
import type { ImagesRepository } from '../repositories/images-repository.js'
import type { Image, CreateImageDTO } from '../schemas/images-schema.js'
import type { ImagesURLsService } from './images-urls-service.js'

export class ImagesService {
  private readonly imagesRepository: ImagesRepository
  private readonly markersRepository: MarkersRepository
  private readonly imagesURLsService: ImagesURLsService

  constructor({ imagesRepository, markersRepository, imagesURLsService }: ImagesInjectableDependencies) {
    this.imagesRepository = imagesRepository
    this.markersRepository = markersRepository
    this.imagesURLsService = imagesURLsService
  }

  async createImageInDb(atlasId: string, markerId: string, imageId: string): Promise<Image> {
    return await this.imagesRepository.createImage({
      atlasId,
      markerId,
      imageId,
    })
  }

  async getImagesForMarker(atlasId: string, markerId: string): Promise<Image[]> {
    const images = await this.imagesRepository.getImagesForMarker(atlasId, markerId)

    for await (const image of images) {
      image.url = await this.imagesURLsService.getUrlForExistingImage(image.atlasId, image.markerId, image.imageId)
    }

    return images
  }

  async getImagesForAtlas(atlasId: string): Promise<Image[]> {
    const images = await this.imagesRepository.getImagesForAtlas(atlasId)
    return images
  }

  async generateUrlsForExistingImages(images: Image[]) {
    for await (const image of images) {
      image.url = await this.imagesURLsService.getUrlForExistingImage(image.atlasId, image.markerId, image.imageId)
    }

    return images
  }

  async getPresignedUrl(atlasId: string, markerId: string): Promise<{ url: string; fields: Record<string, string> }> {
    return await this.imagesURLsService.getPreSignedUrl(atlasId, markerId)
  }

  async processImageUploadedMessages(messages: AppMessage[]): Promise<void> {
    for (const message of messages) {
      const dto = JSON.parse(message.body!) as CreateImageDTO

      await this.imagesRepository.createImage(dto)
      await this.markersRepository.updateImageCount(dto.atlasId, dto.markerId)
    }
  }

  async deleteImages(atlasId: string, imageIds: string[]) {
    return await this.imagesRepository.deleteImages(atlasId, imageIds)
  }

  async updateImage(updatedData: Partial<Image>, atlasId: string, imageId: string): Promise<Image> {
    return await this.imagesRepository.updateImage({ legend: updatedData.legend! }, atlasId, imageId)
  }
}
