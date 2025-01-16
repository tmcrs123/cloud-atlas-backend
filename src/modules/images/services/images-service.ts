import { Message } from "../../../shared/types/index.js";
import { MarkersRepository } from "../../markers/repositories/markers-repository.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { ImagesRepository } from "../repositories/images-repository.js";
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

  async getImagesForMarker(id: string): Promise<void> {
    return;
  }

  async getPresignedUrl(mapId: string, markerId: string): Promise<any> {
    return this.imagesURLsService.getPreSignedUrl(mapId, markerId);
  }

  async processImageUploadedMessages(messages: Message[]): Promise<void> {
    setTimeout(() => null, 50000);
    for (const message of messages) {
      const { mapdId, markerId, imageId } = JSON.parse(message.body!) as any;

      await this.imagesRepository.saveImagesDetails(mapdId, markerId, imageId);
      await this.markersRepository.updateImageCount(mapdId, markerId);
    }
  }
}
