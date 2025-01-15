import { ImagesInjectableDependencies } from "../config/index.js";
import { ImagesRepository } from "../repositories/images-repository.js";

export class ImagesService {
  private readonly imagesRepository: ImagesRepository;

  constructor({ imagesRepository }: ImagesInjectableDependencies) {
    this.imagesRepository = imagesRepository;
  }

  async getImagesForMarker(id: string): Promise<void> {
    return;
  }
}
