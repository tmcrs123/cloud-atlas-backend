import { CreateImageDTO, Image, UpdateImageDTO } from "../schemas/index.js";

export interface ImagesRepository {
  getImagesForMarker(mapId: string, markerId: string): Promise<Image[]>;
  getImagesForMap(mapId: string): Promise<Image[]>;
  createImage(createImageDTO: CreateImageDTO): Promise<Image>;
  updateImage(
    updatedData: UpdateImageDTO,
    mapId: string,
    imageId: string
  ): Promise<Image>;
  deleteImages(mapId: string, imageIds: string[]): Promise<void>;
}
