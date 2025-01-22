import { ImagesService } from "../../images/services/images-service.js";
import {
  CreateMapRequestBody,
  UpdateMapRequestBody,
} from "../../maps/schemas/index.js";
import { MapsService } from "../../maps/services/maps-service.js";
import {
  CreateMarkerRequestBody,
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

  async createMap(request: CreateMapRequestBody, owner: string) {
    return await this.mapsService.createMap(request.title, owner);
  }

  async getMap(mapId: string) {
    return this.mapsService.getMap(mapId);
  }

  async updateMap(updatedData: UpdateMapRequestBody, mapId: string) {
    return await this.mapsService.updateMap({ ...updatedData }, mapId);
  }

  async deleteMap(mapId: string) {
    await this.mapsService.deleteMap(mapId);

    const markers = await this.markersService.getMarkers(mapId);

    if (!markers) return;

    const markerIds = markers.map((marker) => marker.markerId);

    await this.markersService.deleteManyMarkers(markerIds, mapId);

    const images = await this.imagesService.getImagesForMap(mapId);

    if (!images) return;

    const imageIds = images.map((img) => img.imageId);

    this.imagesService.deleteAllImagesForMap(imageIds, mapId);
  }

  async createMarkers(markers: CreateMarkerRequestBody[], mapId: string) {
    return await this.markersService.createManyMarkers([...markers], mapId);
  }

  async updateMarkerDetails(
    updateRequest: UpdateMarkerRequestBody,
    markerId: string,
    mapId: string
  ) {
    return await this.markersService.updateMarker(markerId, mapId, {
      ...updateRequest,
    });
  }

  // delete a marker
  async deleteMarker(markerId: string, mapId: string) {
    await this.markersService.deleteMarker(markerId, mapId);

    const imagesToDelete = await this.imagesService.getImagesForMarker(
      mapId,
      markerId
    );

    await this.imagesService.deleteAllImagesForMarker(mapId, markerId);
  }

  // upload image

  async createPreSignedUrl(mapId: string, markerId: string) {
    return await this.imagesService.getPresignedUrl(mapId, markerId);
  }

  //delete a image

  //updade image comment
}
