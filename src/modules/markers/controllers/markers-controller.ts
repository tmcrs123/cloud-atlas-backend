import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { DomainService } from '../../domain/services/domain-service.js'
import type { CreateMarkersRequestBody, CreateMarkersRequestParams, GetMarkerRequestParams, GetMarkersRequestParams, DeleteMarkersRequestParams, DeleteMarkersRequestBody, DeleteMarkersRequestQueryString, UpdateMarkerRequestBody, UpdateMarkerRequestParams } from '../schemas/markers-schema.js'

export const createMarkers = async (
  request: FastifyRequest<{
    Body: CreateMarkersRequestBody
    Params: CreateMarkersRequestParams
  }>,
  reply: FastifyReply,
) => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const appConfig = request.diScope.resolve<AppConfig>('appConfig')

  const { atlasId } = request.params

  const markers = await domainService.createMarkers(request.body, request.params.atlasId)

  return reply.status(201).header('Location', `${appConfig.getURL()}/markers/${atlasId}`).send(markers)
}

export const getMarker = async (request: FastifyRequest<{ Params: GetMarkerRequestParams }>, reply: FastifyReply) => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const marker = await domainService.getMarker(request.params.atlasId, request.params.markerId)

  if (!marker) return reply.status(404).send()
  return reply.status(200).send(marker)
}

export const getMarkers = async (request: FastifyRequest<{ Params: GetMarkersRequestParams }>, reply: FastifyReply) => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const markers = await domainService.getMarkers(request.params.atlasId)

  return reply.status(200).send(markers)
}

export const deleteMarkers = async (
  request: FastifyRequest<{
    Params: DeleteMarkersRequestParams
    Body: DeleteMarkersRequestBody
    Querystring: DeleteMarkersRequestQueryString
  }>,
  reply: FastifyReply,
) => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  await domainService.deleteMarkers(request.body.markerIds, request.params.atlasId, request.query.all)

  return reply.status(204).send()
}

export const updateMarker = async (
  request: FastifyRequest<{
    Body: UpdateMarkerRequestBody
    Params: UpdateMarkerRequestParams
  }>,
  reply: FastifyReply,
) => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const response = await domainService.updateMarker(request.body, request.params.markerId, request.params.atlasId)

  if (!response) return reply.status(204).send()

  return reply.status(200).send(response)
}
