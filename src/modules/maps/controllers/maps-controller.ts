import { FastifyReply, FastifyRequest } from "fastify";
import { AppConfig } from "../../../shared/configs/index.js";
import { DomainService } from "../../domain/services/index.js";
import {
  CreateMapRequestBody,
  DeleteMapRequestParams,
  GetMapRequestParams,
  UpdateMapRequestBody,
  UpdateMapRequestParams,
} from "../schemas/index.js";

export const createMap = async (
  request: FastifyRequest<{ Body: CreateMapRequestBody }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");
  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  let map = await domainService.createMap(
    { ...request.body },
    request.user.sub
  );
  return reply
    .status(201)
    .header("Location", `${appConfig.getURL()}/maps/${map.mapId}`)
    .send(map);
};

export const getMap = async (
  request: FastifyRequest<{ Params: GetMapRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let map = await domainService.getMap(request.params.mapId);
  if (!map) reply.status(404).send();

  return reply.status(200).send(map);
};

export const deleteMap = async (
  request: FastifyRequest<{ Params: DeleteMapRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");
  await domainService.deleteMap(request.params.mapId);

  return reply.status(204).send();
};

export const updateMap = async (
  request: FastifyRequest<{
    Body: UpdateMapRequestBody;
    Params: UpdateMapRequestParams;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");
  const updatedMap = await domainService.updateMap(
    request.body,
    request.params.mapId
  );

  if (!updatedMap) return reply.status(204).send();
  return reply.status(200).send(updatedMap);
};
