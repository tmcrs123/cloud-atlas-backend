import { TopicService } from "../../../infrastructure/topic/interfaces/index.js";
import { Message } from "../../../shared/types/index.js";
import { MarkersRepository } from "../../markers/repositories/markers-repository.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { ImagesRepository } from "../repositories/images-repository.js";
import { CreateImageDTO, Image } from "../schemas/index.js";
import { ImagesURLsService } from "./index.js";

export class ImagesService {
  private readonly imagesRepository: ImagesRepository;
  private readonly markersRepository: MarkersRepository;
  private readonly imagesURLsService: ImagesURLsService;

  constructor({
    imagesRepository,
    markersRepository,
    imagesURLsService,
  }: ImagesInjectableDependencies) {
    this.imagesRepository = imagesRepository;
    this.markersRepository = markersRepository;
    this.imagesURLsService = imagesURLsService;
  }

  async getImagesForMarker(
    mapId: string,
    markerId: string
  ): Promise<Image[] | null> {
    const images = await this.imagesRepository.getImagesForMarker(
      mapId,
      markerId
    );

    if (!images) return null;

    for await (const image of images) {
      image.url = await this.imagesURLsService.getUrlForExistingImage(
        image.mapId,
        image.markerId,
        image.imageId
      );
    }

    return images;
  }

  async getImagesForMap(mapId: string): Promise<Image[] | null> {
    const images = await this.imagesRepository.getImagesForMap(mapId);

    if (!images) return null;

    for await (const image of images) {
      image.url = await this.imagesURLsService.getUrlForExistingImage(
        image.mapId,
        image.markerId,
        image.imageId
      );
    }

    return images;
  }

  async getPresignedUrl(mapId: string, markerId: string): Promise<any> {
    return this.imagesURLsService.getPreSignedUrl(mapId, markerId);
  }

  async processImageUploadedMessages(messages: Message[]): Promise<void> {
    for (const message of messages) {
      const dto = JSON.parse(message.body!) as CreateImageDTO;

      await this.imagesRepository.createImage(dto);
      await this.markersRepository.updateImageCount(dto.mapId, dto.markerId);
    }
  }

  async deleteImages(mapId: string, imageIds: string[]) {
    return await this.imagesRepository.deleteImages(mapId, imageIds);
  }

  async updateImage(
    updatedData: Partial<Image>,
    mapId: string,
    imageId: string
  ): Promise<Image> {
    return await this.imagesRepository.updateImage(
      { legend: updatedData.legend! },
      mapId,
      imageId
    );
  }
}
