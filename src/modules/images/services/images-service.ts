import { randomUUID } from "crypto";
import { Topic } from "../../../infrastructure/topic/interfaces/index.js";
import { Message } from "../../../shared/types/index.js";
import { MarkersRepository } from "../../markers/repositories/markers-repository.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { ImagesRepository } from "../repositories/images-repository.js";
import { ImagesURLsService } from "./index.js";
import { Image } from "../schemas/index.js";

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
    return await this.imagesRepository.getImagesForMarker(mapId, markerId);
  }

  async getImagesForMap(mapId: string): Promise<Image[] | null> {
    return await this.imagesRepository.getImagesForMap(mapId);
  }

  async getPresignedUrl(mapId: string, markerId: string): Promise<any> {
    return this.imagesURLsService.getPreSignedUrl(mapId, markerId);
  }

  async processImageUploadedMessages(messages: Message[]): Promise<void> {
    for (const message of messages) {
      const { mapId, markerId, imageId } = JSON.parse(message.body!) as any;

      await this.imagesRepository.saveImagesDetails(mapId, markerId, imageId);
      await this.markersRepository.updateImageCount(markerId, mapId);
    }
  }

  // this is just a helper method, not to be invoked by the clients
  async saveImageDetails(mapId: string, markerId: string): Promise<void> {
    await this.imagesRepository.saveImagesDetails(
      mapId,
      markerId,
      randomUUID()
    );
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
}
