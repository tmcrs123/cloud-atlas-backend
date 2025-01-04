import { FastifyReply, FastifyRequest } from "fastify";
import { CREATE_MAP_SCHEMA_TYPE } from "../schemas";
import { MapsService } from "../services/maps-service";

export const createMap = async(request: FastifyRequest<{Body: CREATE_MAP_SCHEMA_TYPE}>, reply: FastifyReply): Promise<void> => {
    const {title} = request.body;
    const mapsService = request.diScope.resolve<MapsService>('mapsService')

    //mapsServices
    let test = await mapsService.createMap({title:'test'})

    return reply.status(201).send(test)

}