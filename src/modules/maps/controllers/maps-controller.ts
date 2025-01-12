import { FastifyReply, FastifyRequest } from "fastify";
import { CREATE_SNAPPIN_SCHEMA_TYPE, SnappinMap } from "../schemas";
import { MapsService } from "../services/maps-service";
import { AppConfig } from "../../../shared/configs";

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
