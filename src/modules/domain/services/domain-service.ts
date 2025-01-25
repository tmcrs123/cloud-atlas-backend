import { TopicService } from "../../../infrastructure/topic/interfaces/topic.js";
import { AppConfig } from "../../../shared/configs/app-config.js";
import { stripProperties } from "../../../utils/index.js";
import {
  Image,
  UpdateImageDetailsRequestBody,
} from "../../images/schemas/images-schema.js";
import { ImagesService } from "../../images/services/images-service.js";
import {
  CreateMapRequestBody,
  Map,
  UpdateMapRequestBody,
} from "../../maps/schemas/index.js";
import { MapsService } from "../../maps/services/maps-service.js";
import {
  CreateMarkersRequestBody,
  UpdateMarkerRequestBody,
} from "../../markers/schemas/index.js";
import { MarkersService } from "../../markers/services/markers-service.js";
import { DomainInjectableDependencies } from "../domain-config.js";

export class DomainService {
  private readonly mapsService: MapsService;
  private readonly markersService: MarkersService;
  private readonly imagesService: ImagesService;
  private readonly appConfig: AppConfig;
  private readonly topicService: TopicService;

  constructor({
    mapsService,
    markersService,
    imagesService,
    appConfig,
    topicService,
  }: DomainInjectableDependencies) {
    this.mapsService = mapsService;
    this.markersService = markersService;
    this.imagesService = imagesService;
    (this.appConfig = appConfig), (this.topicService = topicService);
  }

  async createMap(request: CreateMapRequestBody, owner: string) {
    const map = await this.mapsService.createMap(request.title, owner);
    return stripProperties<Partial<Map>>({ ...map }, ["owner"]);
  }

  async getMapsForUser(owner: string) {
    const maps = await this.mapsService.getMapsByOwner(owner);
    return maps?.map((map) => {
      return stripProperties<Map>(map, ["owner", "claims"]);
    });
  }

  async getMapsDetails(mapIds: string[]) {
    const maps = await this.mapsService.getMapsDetails(mapIds);
    return maps?.map((map) => {
      return stripProperties<Map>(map, ["owner", "claims"]);
    });
  }

  async updateMap(updatedData: UpdateMapRequestBody, mapId: string) {
    const updatedMap = await this.mapsService.updateMap(
      { ...updatedData },
      mapId
    );
    if (!updatedMap) return null;
    return stripProperties<Partial<Map>>(updatedMap, ["owner", "claims"]);
  }

  async deleteMap(owner: string, mapId: string) {
    await this.mapsService.deleteMap(owner, mapId);

    const markers = await this.markersService.getMarkers(mapId);

    if (!markers) return;

    const markerIds = markers.map((marker) => marker.markerId);

    await this.markersService.deleteMarkers(markerIds, mapId);

    const images = await this.imagesService.getImagesForMap(mapId);

    if (!images) return;

    const imageIds = images.map((img) => img.imageId);

    this.imagesService.deleteImages(mapId, imageIds);

    if (this.appConfig.configurations.topicEnabled) {
      for await (const image of images) {
        this.topicService.pushMessageToTopic(
          mapId,
          image.markerId,
          image.imageId
        );
      }
    }
  }

  //#region markers
  async createMarkers(request: CreateMarkersRequestBody, mapId: string) {
    return await this.markersService.createMarkers([...request.markers], mapId);
  }

  async updateMarker(
    request: UpdateMarkerRequestBody,
    markerId: string,
    mapId: string
  ) {
    return await this.markersService.updateMarker(markerId, mapId, {
      ...request,
    });
  }

  async deleteMarkers(markerIds: string[], mapId: string, deleteAll = false) {
    await this.markersService.deleteMarkers(markerIds, mapId, deleteAll);

    for await (const markerId of markerIds) {
      const images = await this.imagesService.getImagesForMarker(
        mapId,
        markerId
      );
      if (!images) continue;

      await this.imagesService.deleteImages(
        mapId,
        images.map((img) => img.imageId)
      );

      if (this.appConfig.configurations.topicEnabled) {
        for await (const image of images) {
          this.topicService.pushMessageToTopic(
            mapId,
            image.markerId,
            image.imageId
          );
        }
      }
    }
  }

  async getMarker(mapId: string, markerId: string) {
    return await this.markersService.getMarker(mapId, markerId);
  }

  async getMarkers(mapId: string) {
    return await this.markersService.getMarkers(mapId);
  }
  //#endregion

  //#region IMAGES
  async getImagesForMap(mapId: string) {
    const images = await this.imagesService.getImagesForMap(mapId);

    if (!images) return null;

    await this.imagesService.generateUrlsForExistingImages(images);

    const urls = images.map((image) => {
      return stripProperties<Partial<Image>>(image, [
        "mapId",
        "markerId",
        "imageId",
      ]).url;
    });

    return urls;
  }

  async getImagesForMarker(mapId: string, markerId: string) {
    const images = await this.imagesService.getImagesForMarker(mapId, markerId);

    if (!images) return null;

    return images.map((image) => {
      return stripProperties<Partial<Image>>(image, [
        "mapId",
        "markerId",
        "imageId",
      ]);
    });
  }

  async deleteImageForMarker(mapId: string, markerId: string, imageId: string) {
    await this.imagesService.deleteImages(mapId, [imageId]);
    return;
  }

  async updateImage(
    requestBody: UpdateImageDetailsRequestBody,
    mapId: string,
    imageId: string
  ) {
    this.imagesService.updateImage(requestBody, mapId, imageId);
  }

  async uploadImage(mapId: string, markerId: string) {
    return await this.imagesService.getPresignedUrl(mapId, markerId);
  }
  //#endregion
}
