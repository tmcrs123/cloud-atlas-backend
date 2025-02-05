import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateImageInDbRequestParams, DeleteImageFromMarkerRequestParams, GetImagesForAtlasRequestParams, GetImagesForMarkerRequestParams, GetPresignedUrlRequestParams, Image, UpdateImageDetailsRequestBody, UpdateImageDetailsRequestParams } from '../schemas/images-schema.js'
import type { DomainService } from '../../domain/services/domain-service.js'

export const getImagesForAtlas = async (request: FastifyRequest<{ Params: GetImagesForAtlasRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const images = await domainService.getImagesForAtlas(request.params.atlasId)

  return reply.status(200).send(images)
}

export const createImageDetailsInDb = async (request: FastifyRequest<{ Params: CreateImageInDbRequestParams }>, reply: FastifyReply): Promise<Image> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const image = await domainService.createImageInDb(request.params.atlasId, request.params.markerId, request.params.imageId)

  return reply.status(201).send(image)
}

export const getImagesForMarker = async (request: FastifyRequest<{ Params: GetImagesForMarkerRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const images = await domainService.getImagesForMarker(request.params.atlasId, request.params.markerId)

  return reply.status(200).send(images)
}

export const uploadImage = async (request: FastifyRequest<{ Params: GetPresignedUrlRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const preSignedUrl = await domainService.uploadImage(request.params.atlasId, request.params.markerId)

  return reply.status(200).send(preSignedUrl)
}

export const updateImage = async (
  request: FastifyRequest<{
    Params: UpdateImageDetailsRequestParams
    Body: UpdateImageDetailsRequestBody
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  await domainService.updateImage(request.body, request.params.atlasId, request.params.imageId)

  return reply.status(201).send()
}

export const deleteImageFromMarker = async (
  request: FastifyRequest<{
    Params: DeleteImageFromMarkerRequestParams
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  await domainService.deleteImageForMarker(request.params.atlasId, request.params.markerId, request.params.imageId)

  return reply.status(204).send()
}
