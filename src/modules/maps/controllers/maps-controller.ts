import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AppConfig } from '../../../shared/configs/index.js'
import type { DomainService } from '../../domain/services/index.js'
import type { CreateMapRequestBody, DeleteMapRequestParams, GetMapsRequestParams, UpdateMapRequestBody, UpdateMapRequestParams } from '../schemas/index.js'

export const createMap = async (request: FastifyRequest<{ Body: CreateMapRequestBody }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const appConfig = request.diScope.resolve<AppConfig>('appConfig')

  const map = await domainService.createMap({ ...request.body }, request.user.sub)
  return reply.status(201).header('Location', `${appConfig.getURL()}/maps/${map.mapId}`).send(map)
}

export const getMapsForUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const maps = await domainService.getMapsForUser(request.user.sub)
  return reply.status(200).send(maps)
}

export const getMapsDetails = async (request: FastifyRequest<{ Params: GetMapsRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const ids = request.params.mapIds.split(',')
  const maps = await domainService.getMapsDetails(ids)
  return reply.status(200).send(maps)
}

export const deleteMap = async (request: FastifyRequest<{ Params: DeleteMapRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  await domainService.deleteMap(request.user.sub, request.params.mapId)

  return reply.status(204).send()
}

export const updateMap = async (
  request: FastifyRequest<{
    Body: UpdateMapRequestBody
    Params: UpdateMapRequestParams
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const updatedMap = await domainService.updateMap(request.body, request.params.mapId)

  if (!updatedMap) return reply.status(204).send()
  return reply.status(200).send(updatedMap)
}
