import { stripProperties } from "../../../utils/index.js";
import {
  Image,
  UpdateImageDetailsRequestBody,
} from "../../images/schemas/images-schema.js";
import { ImagesService } from "../../images/services/images-service.js";
import {
  CreateMapRequestBody,
  UpdateMapRequestBody,
} from "../../maps/schemas/index.js";
import { MapsService } from "../../maps/services/maps-service.js";
import {
  CreateMarkersRequestBody,
  Marker,
  UpdateMarkerRequestBody,
} from "../../markers/schemas/index.js";
import { MarkersService } from "../../markers/services/markers-service.js";
import { DomainInjectableDependencies } from "../domain-config.js";

export class DomainService {
  private readonly mapsService: MapsService;
  private readonly markersService: MarkersService;
  private readonly imagesService: ImagesService;

  constructor({
    mapsService,
    markersService,
    imagesService,
  }: DomainInjectableDependencies) {
    this.mapsService = mapsService;
    this.markersService = markersService;
    this.imagesService = imagesService;
  }

  async userCreatesMap(request: CreateMapRequestBody, owner: string) {
    return await this.mapsService.createMap(request.title, owner);
  }

  async userRetrievesMap(mapId: string) {
    return this.mapsService.getMap(mapId);
  }

  async userUpdatesMap(updatedData: UpdateMapRequestBody, mapId: string) {
    return await this.mapsService.updateMap({ ...updatedData }, mapId);
  }

  async userDeletesMap(mapId: string) {
    await this.mapsService.deleteMap(mapId);

    const markers = await this.markersService.getMarkers(mapId);

    if (!markers) return;

    const markerIds = markers.map((marker) => marker.markerId);

    await this.markersService.deleteMarkers(markerIds, mapId);

    const images = await this.imagesService.getImagesForMap(mapId);

    if (!images) return;

    const imageIds = images.map((img) => img.imageId);

    this.imagesService.deleteAllImagesForMap(imageIds, mapId);
  }

  //#region markers
  //x
  async createMarkers(request: CreateMarkersRequestBody, mapId: string) {
    return await this.markersService.createMarkers([...request.markers], mapId);
  }

  //X
  async updateMarker(
    request: UpdateMarkerRequestBody,
    markerId: string,
    mapId: string
  ) {
    return await this.markersService.updateMarker(markerId, mapId, {
      ...request,
    });
  }

  //x
  async deleteMarker(markerId: string, mapId: string) {
    await this.markersService.deleteMarker(markerId, mapId);
    // await this.imagesService.deleteAllImagesForMarker(markerId, mapId);
  }

  //x
  async deleteMarkers(markerIds: string[], mapId: string, deleteAll = false) {
    await this.markersService.deleteMarkers(markerIds, mapId, deleteAll);
    // await this.imagesService.deleteAllImagesForMarker(markerId, mapId);
  }

  //x
  async getMarker(mapId: string, markerId: string) {
    return await this.markersService.getMarker(mapId, markerId);
  }

  //x
  async getMarkers(mapId: string) {
    return await this.markersService.getMarkers(mapId);
  }
  //#endregion

  //#region IMAGES
  //x
  async getImagesForMap(mapId: string) {
    const images = await this.imagesService.getImagesForMap(mapId);

    if (!images) return null;

    const urls = images.map((image) => {
      return stripProperties<Partial<Image>>(image, [
        "mapId",
        "markerId",
        "imageId",
      ]).url;
    });

    return urls;
  }

  //x
  async getImagesForMarker(mapId: string, markerId: string) {
    const images = await this.imagesService.getImagesForMarker(mapId, markerId);

    if (!images) return null;

    const urls = images.map((image) => {
      return stripProperties<Partial<Image>>(image, [
        "mapId",
        "markerId",
        "imageId",
      ]).url;
    });

    return urls;
  }

  //x
  async deleteImageForMarker(mapId: string, markerId: string, imageId: string) {
    await this.imagesService.deleteImageForMarker(mapId, markerId, imageId);
    return;
  }

  //x
  async updateImage(
    requestBody: UpdateImageDetailsRequestBody,
    mapId: string,
    imageId: string
  ) {
    this.imagesService.updateImage(requestBody, mapId, imageId);
  }

  // x
  async uploadImage(mapId: string, markerId: string) {
    return await this.imagesService.getPresignedUrl(mapId, markerId);
  }
  //#endregion
}
