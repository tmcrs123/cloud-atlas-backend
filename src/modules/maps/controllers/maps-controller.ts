import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateMapRequestBody,
  DeleteMapRequestParams,
  GetMapRequestParams,
  UpdateMapRequestBody,
  UpdateMapRequestParams,
} from "../schemas/index.js";
import { MapsService } from "../services/index.js";
import { AppConfig } from "../../../shared/configs/index.js";

export const createMap = async (
  request: FastifyRequest<{ Body: CreateMapRequestBody }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");
  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  let map = await mapsService.createMap({ ...request.body }, request.user.sub);

  return reply
    .status(201)
    .header("Location", `${appConfig.getURL()}/maps/${map.id}`)
    .send(map);
};

export const getMap = async (
  request: FastifyRequest<{ Params: GetMapRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");
  const { id } = request.params;

  let map = await mapsService.getMap(id);
  if (!map) reply.status(404).send();

  return reply.status(200).send(map);
};

export const deleteMap = async (
  request: FastifyRequest<{ Params: DeleteMapRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");
  const { id } = request.params;

  await mapsService.deleteMap(id);

  return reply.status(204).send();
};

export const updateMap = async (
  request: FastifyRequest<{
    Body: UpdateMapRequestBody;
    Params: UpdateMapRequestParams;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  const response = await mapsService.updateMap(request.body, request.params.id);

  if (!response) return reply.status(204).send();
  return reply.status(200).send(response);
};
