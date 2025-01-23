import { CreateImageDTO, Image, UpdateImageDTO } from "../schemas/index.js";

export interface ImagesRepository {
  getImagesForMarker(mapId: string, markerId: string): Promise<Image[] | null>;
  getImagesForMap(mapId: string): Promise<Image[] | null>;
  createImage(createImageDTO: CreateImageDTO): Promise<Image>;
  updateImage(
    updatedData: UpdateImageDTO,
    mapId: string,
    imageId: string
  ): Promise<Image>;
  deleteImages(mapId: string, imageIds: string[]): Promise<void>;
}
