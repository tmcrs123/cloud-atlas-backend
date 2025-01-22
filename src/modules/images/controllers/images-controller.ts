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

export const getPresignedURL = async (
  request: FastifyRequest<{ Params: { mapId: string; markerId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  let url = await imagesService.getPresignedUrl(
    request.params.mapId,
    request.params.markerId
  );

  return reply.status(200).send(url);
};

export const deleteImageFromMarker = async (
  request: FastifyRequest<{
    Params: { mapId: string; markerId: string; imageId: string };
  }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  await imagesService.deleteImageForMarker(
    request.params.mapId,
    request.params.markerId,
    request.params.imageId
  );

  return reply.status(204).send();
};
