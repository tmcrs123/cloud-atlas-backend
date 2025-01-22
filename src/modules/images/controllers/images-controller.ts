import { FastifyRequest, FastifyReply } from "fastify";
import { ImagesService } from "../services/index.js";

export const getImagesForMarker = async (
  request: FastifyRequest<{ Params: { mapId: string; markerId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  let images = await imagesService.getImagesForMarker(
    request.params.mapId,
    request.params.markerId
  );

  return reply.status(200).send(images);
};

export const getImagesForMap = async (
  request: FastifyRequest<{ Params: { mapId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  let images = await imagesService.getImagesForMap(request.params.mapId);

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

export const saveImageDetails = async (
  request: FastifyRequest<{
    Params: { mapId: string; markerId: string };
  }>,
  reply: FastifyReply
): Promise<void> => {
  const imagesService = request.diScope.resolve<ImagesService>("imagesService");

  await imagesService.saveImageDetails(
    request.params.mapId,
    request.params.markerId
  );

  return reply.status(201).send();
};
