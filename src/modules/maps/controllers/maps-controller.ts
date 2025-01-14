import { FastifyReply, FastifyRequest } from "fastify";
import RequestValidationError from "../../../errors/request-validation-error.js";
import {
  CREATE_SNAPPIN_MAP_SCHEMA_TYPE,
  DELETE_SNAPPIN_MAP_SCHEMA_TYPE,
  GET_SNAPPIN_MAP_SCHEMA_TYPE,
  UPDATE_SNAPPIN_MAP_BODY_SCHEMA_TYPE,
  UPDATE_SNAPPIN_MAP_PARAMS_SCHEMA_TYPE,
} from "../schemas/index.js";
import { MapsService } from "../services/index.js";

export const createMap = async (
  request: FastifyRequest<{ Body: CREATE_SNAPPIN_MAP_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const { title } = request.body;
  const { sub } = request.user;
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  let map = await mapsService.createMap({ title, owner: sub });

  return reply.status(201).header("Location", `/maps/${map.id}`).send(map);
};

export const getMap = async (
  request: FastifyRequest<{ Params: GET_SNAPPIN_MAP_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");
  const { id } = request.params;

  let map = await mapsService.getMap(id);
  if (!map) reply.status(404).send();

  return reply.status(200).send(map);
};

export const deleteMap = async (
  request: FastifyRequest<{ Params: DELETE_SNAPPIN_MAP_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");
  const { id } = request.params;

  await mapsService.deleteMap(id);

  return reply.status(204).send();
};

export const updateMap = async (
  request: FastifyRequest<{
    Body: UPDATE_SNAPPIN_MAP_BODY_SCHEMA_TYPE;
    Params: UPDATE_SNAPPIN_MAP_PARAMS_SCHEMA_TYPE;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  const response = await mapsService.updateMap(request.params.id, request.body);

  if (!response) return reply.status(204).send();
  return reply.status(200).send(response);
};
