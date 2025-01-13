import { FastifyReply, FastifyRequest } from "fastify";
import { AppConfig } from "../../../shared/configs/index.js";
import { CREATE_SNAPPIN_SCHEMA_TYPE } from "../schemas/index.js";
import { MapsService } from "../services/index.js";

export const createMap = async (
  request: FastifyRequest<{ Body: CREATE_SNAPPIN_SCHEMA_TYPE }>,
  reply: FastifyReply
): Promise<void> => {
  const { title } = request.body;
  // const{user} = request.user
  const mapsService = request.diScope.resolve<MapsService>("mapsService");

  console.log(request.user);

  //mapsServices
  let map = await mapsService.createMap({ title, ownerId: "123rr" });

  return reply.status(201).header("Location", "/bananas").send(map);
};

export const getMap = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const appConfig = request.diScope.resolve<AppConfig>("appConfig");
  console.log(request.user);
  return reply.status(201).send("ok");
};
