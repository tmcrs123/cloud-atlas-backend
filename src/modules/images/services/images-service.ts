import { Topic } from "../../../infrastructure/topic/interfaces/index.js";
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
  private readonly topic: Topic;

  constructor({
    imagesRepository,
    markersRepository,
    imagesURLsService,
    topic,
  }: ImagesInjectableDependencies) {
    this.imagesRepository = imagesRepository;
    this.markersRepository = markersRepository;
    this.imagesURLsService = imagesURLsService;
    this.topic = topic;
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

  async deleteImageForMarker(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void> {
    await this.imagesRepository.deleteImageFromMarker(mapId, markerId, imageId);

    // await this.topic.pushMessageToTopic(mapId, markerId, imageId);
  }

  async deleteAllImagesForMap(
    imageDetails: any[],
    mapId: string
  ): Promise<void> {
    const imageIds = imageDetails.map((img) => img.imageId);

    await this.imagesRepository.deleteAllImagesForMap(imageIds, mapId);

    imageDetails.forEach((img) => {
      // this.topic.pushMessageToTopic(mapId, img.markerId, img.imageId);
    });
  }

  async deleteAllImagesForMarker(
    markerId: string,
    mapId: string
  ): Promise<void> {
    await this.imagesRepository.deleteAllImagesForMarker(markerId, mapId);

    // this.topic.pushMessageToTopic(mapId, img.markerId, img.imageId);
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
