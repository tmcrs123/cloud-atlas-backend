import type { TopicService } from '../../../infrastructure/topic/interfaces/topic.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import { stripProperties } from '../../../utils/stripProperties.js'
import type { Atlas, CreateAtlasRequestBody, UpdateAtlasRequestBody } from '../../atlas/schemas/atlas-schema.js'
import type { AtlasService } from '../../atlas/services/atlas-service.js'
import type { Image, UpdateImageDetailsRequestBody } from '../../images/schemas/images-schema.js'
import type { ImagesService } from '../../images/services/images-service.js'
import type { CreateMarkersRequestBody, UpdateMarkerRequestBody } from '../../markers/schemas/markers-schema.js'
import type { MarkersService } from '../../markers/services/markers-service.js'
import type { DomainInjectableDependencies } from '../domain-config.js'

export class DomainService {
  private readonly atlasService: AtlasService
  private readonly markersService: MarkersService
  private readonly imagesService: ImagesService
  private readonly appConfig: AppConfig
  private readonly topicService: TopicService

  constructor({ atlasService, markersService, imagesService, appConfig, topicService }: DomainInjectableDependencies) {
    this.atlasService = atlasService
    this.markersService = markersService
    this.imagesService = imagesService
    this.appConfig = appConfig
    this.topicService = topicService
  }

  async createAtlas(request: CreateAtlasRequestBody, owner: string) {
    const atlas = await this.atlasService.createAtlas(request.title, owner)
    return stripProperties<Partial<Atlas>>({ ...atlas }, ['owner'])
  }

  async getAtlasForUser(owner: string) {
    const atlas = await this.atlasService.getAtlasByOwner(owner)
    return atlas?.map((atlas) => {
      return stripProperties<Atlas>(atlas, ['owner', 'claims'])
    })
  }

  async getAtlasDetails(atlasIds: string[]) {
    const atlas = await this.atlasService.getAtlasDetails(atlasIds)
    return atlas?.map((atlas) => {
      return stripProperties<Atlas>(atlas, ['owner', 'claims'])
    })
  }

  async updateAtlas(updatedData: UpdateAtlasRequestBody, atlasId: string) {
    const updatedAtlas = await this.atlasService.updateAtlas({ ...updatedData }, atlasId)
    if (!updatedAtlas) return null
    return stripProperties<Partial<Atlas>>(updatedAtlas, ['owner', 'claims'])
  }

  async deleteAtlas(owner: string, atlasId: string) {
    await this.atlasService.deleteAtlas(owner, atlasId)

    const markers = await this.markersService.getMarkers(atlasId)

    if (!markers || markers.length === 0) return

    const markerIds = markers.map((marker) => marker.markerId)

    await this.markersService.deleteMarkers(markerIds, atlasId)

    const images = await this.imagesService.getImagesForAtlas(atlasId)

    if (!images || images.length === 0) return

    const imageIds = images.map((img) => img.imageId)

    this.imagesService.deleteImages(atlasId, imageIds)

    if (this.appConfig.configurations.topicEnabled) {
      for await (const image of images) {
        this.topicService.pushMessageToTopic(atlasId, image.markerId, image.imageId)
      }
    }
  }

  //#region markers
  async createMarkers(request: CreateMarkersRequestBody, atlasId: string) {
    return await this.markersService.createMarkers([...request.markers], atlasId)
  }

  async updateMarker(request: UpdateMarkerRequestBody, markerId: string, atlasId: string) {
    return await this.markersService.updateMarker(markerId, atlasId, {
      ...request,
    })
  }

  async deleteMarkers(markerIds: string[], atlasId: string, deleteAll = false) {
    await this.markersService.deleteMarkers(markerIds, atlasId, deleteAll)

    for await (const markerId of markerIds) {
      const images = await this.imagesService.getImagesForMarker(atlasId, markerId)
      if (!images) continue

      await this.imagesService.deleteImages(
        atlasId,
        images.map((img) => img.imageId),
      )

      if (this.appConfig.configurations.topicEnabled) {
        for await (const image of images) {
          this.topicService.pushMessageToTopic(atlasId, image.markerId, image.imageId)
        }
      }
    }
  }

  async getMarker(atlasId: string, markerId: string) {
    return await this.markersService.getMarker(atlasId, markerId)
  }

  async getMarkers(atlasId: string) {
    return await this.markersService.getMarkers(atlasId)
  }
  //#endregion

  //#region IMAGES
  async getImagesForAtlas(atlasId: string) {
    const images = await this.imagesService.getImagesForAtlas(atlasId)

    if (!images) return null

    await this.imagesService.generateUrlsForExistingImages(images)

    const urls = images.map((image) => {
      return stripProperties<Partial<Image>>(image, ['atlasId', 'markerId', 'imageId']).url
    })

    return urls
  }

  async createImageInDb(atlasId: string, markerId: string, imageId: string) {
    return await this.imagesService.createImageInDb(atlasId, markerId, imageId)
  }

  async getImagesForMarker(atlasId: string, markerId: string) {
    const images = await this.imagesService.getImagesForMarker(atlasId, markerId)

    if (!images) return null

    return images.map((image) => {
      return stripProperties<Partial<Image>>(image, ['markerId', 'atlasId'])
    })
  }

  async deleteImageForMarker(atlasId: string, markerId: string, imageId: string) {
    await this.imagesService.deleteImages(atlasId, [imageId])

    if (this.appConfig.configurations.topicEnabled) {
      this.topicService.pushMessageToTopic(atlasId, markerId, imageId)
    }
    return
  }

  async updateImage(requestBody: UpdateImageDetailsRequestBody, atlasId: string, imageId: string) {
    return await this.imagesService.updateImage(requestBody, atlasId, imageId)
  }

  async uploadImage(atlasId: string, markerId: string) {
    return await this.imagesService.getPresignedUrl(atlasId, markerId)
  }
  //#endregion
}
