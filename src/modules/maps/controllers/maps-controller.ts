import { FastifyReply, FastifyRequest } from "fastify";
import { CREATE_MAP_SCHEMA_TYPE } from "../schemas";
import { MapsService } from "../services/maps-service";
import { AppConfig } from "../../../shared/configs";

export const createMap = async (
  request: FastifyRequest<{ Body: CREATE_MAP_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const { title } = request.body;
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  //mapsServices
  let test = await mapsService.createMap({ title });

  return reply.status(201).send(test);
};

export const getMap = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  console.log(appConfig);

  return reply.status(201).send("ok");
};
