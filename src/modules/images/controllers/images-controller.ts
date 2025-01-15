import { FastifyRequest, FastifyReply } from "fastify";
import { ImagesService } from "../services/index.js";

export const getImagesForMarker = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  let images = await imagesService.getImagesForMarker(request.params.id);

  return reply.status(200).send(images);
};
