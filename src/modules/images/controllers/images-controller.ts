import { FastifyReply, FastifyRequest } from "fastify";
import { DomainService } from "../../domain/services/index.js";
import {
  CreateImageInDbRequestParams,
  DeleteImageFromMarkerRequestParams,
  GetImagesForMapRequestParams,
  GetImagesForMarkerRequestParams,
  GetPresignedUrlRequestParams,
  UpdateImageDetailsRequestBody,
  UpdateImageDetailsRequestParams,
} from "../schemas/images-schema.js";

export const getImagesForMap = async (
  request: FastifyRequest<{ Params: GetImagesForMapRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let images = await domainService.getImagesForMap(request.params.mapId);

  return reply.status(200).send(images);
};

export const createImageDetailsInDb = async (
  request: FastifyRequest<{ Params: CreateImageInDbRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let image = await domainService.createImageInDb(
    request.params.mapId,
    request.params.markerId,
    request.params.imageId
  );

  return reply.status(201).send(image);
};

export const getImagesForMarker = async (
  request: FastifyRequest<{ Params: GetImagesForMarkerRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let images = await domainService.getImagesForMarker(
    request.params.mapId,
    request.params.markerId
  );

  return reply.status(200).send(images);
};

export const uploadImage = async (
  request: FastifyRequest<{ Params: GetPresignedUrlRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let preSignedUrl = await domainService.uploadImage(
    request.params.mapId,
    request.params.markerId
  );

  return reply.status(200).send(preSignedUrl);
};

export const updateImage = async (
  request: FastifyRequest<{
    Params: UpdateImageDetailsRequestParams;
    Body: UpdateImageDetailsRequestBody;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  await domainService.updateImage(
    request.body,
    request.params.mapId,
    request.params.imageId
  );

  return reply.status(201).send();
};

export const deleteImageFromMarker = async (
  request: FastifyRequest<{
    Params: DeleteImageFromMarkerRequestParams;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  await domainService.deleteImageForMarker(
    request.params.mapId,
    request.params.markerId,
    request.params.imageId
  );

  return reply.status(204).send();
};
