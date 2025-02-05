import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { DomainService } from '../../domain/services/domain-service.js'
import type { CreateAtlasRequestBody, DeleteAtlasRequestParams, GetAtlasRequestParams, UpdateAtlasRequestBody, UpdateAtlasRequestParams } from '../schemas/atlas-schema.js'

export const createAtlas = async (request: FastifyRequest<{ Body: CreateAtlasRequestBody }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const appConfig = request.diScope.resolve<AppConfig>('appConfig')

  const atlas = await domainService.createAtlas({ ...request.body }, request.user.sub)
  return reply.status(201).header('Location', `${appConfig.getURL()}/atlas/${atlas.atlasId}`).send(atlas)
}

export const getAtlasForUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')

  const atlas = await domainService.getAtlasForUser(request.user.sub)
  return reply.status(200).send(atlas)
}

export const getAtlasDetails = async (request: FastifyRequest<{ Params: GetAtlasRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const ids = request.params.atlasIds.split(',')
  const atlas = await domainService.getAtlasDetails(ids)
  return reply.status(200).send(atlas)
}

export const deleteAtlas = async (request: FastifyRequest<{ Params: DeleteAtlasRequestParams }>, reply: FastifyReply): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  await domainService.deleteAtlas(request.user.sub, request.params.atlasId)

  return reply.status(204).send()
}

export const updateAtlas = async (
  request: FastifyRequest<{
    Body: UpdateAtlasRequestBody
    Params: UpdateAtlasRequestParams
  }>,
  reply: FastifyReply,
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>('domainService')
  const updatedAtlas = await domainService.updateAtlas(request.body, request.params.atlasId)

  if (!updatedAtlas) return reply.status(204).send()
  return reply.status(200).send(updatedAtlas)
}
