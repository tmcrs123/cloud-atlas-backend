import { FastifyReply, FastifyRequest } from "fastify";
import RequestValidationError from "../../../errors/request-validation-error.js";
import { CREATE_SNAPPIN_SCHEMA_TYPE } from "../schemas/index.js";
import { MapsService } from "../services/index.js";

export const createMap = async (
  request: FastifyRequest<{ Body: CREATE_SNAPPIN_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const { title } = request.body;
  const { sub } = request.user;
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  let map = await mapsService.createMap({ title, owner: sub });

  return reply.status(201).header("Location", `/maps/${map.id}`).send(map);
};

export const getMap = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  throw new RequestValidationError("bananas");
  // return reply.status(201).send("ok");
};
