import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSnappinMarkerRequestBody } from "../schemas/index.js";
import { MarkersService } from "../services/index.js";
import { randomUUID } from "crypto";

export const createMarker = async (
  request: FastifyRequest<{ Body: CreateSnappinMarkerRequestBody }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  let marker = await markersService.createMarker({
    ...request.body,
    createdAt: new Date().toUTCString(),
    imageCount: 0,
    id: randomUUID(),
  });

  return reply.status(201).send(marker);
};

export const createManyMarkers = async (
  request: FastifyRequest<{ Body: CreateSnappinMarkerRequestBody[] }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  let marker = await markersService.createManyMarkers(request.body);

  return reply.status(201).send(marker);
};

export const getMarker = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  let marker = await markersService.getMarker(request.params.id);

  if (!marker) return reply.status(404).send();
  return reply.status(200).send(marker);
};

export const deleteMarker = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  await markersService.deleteMarker(request.params.id);

  return reply.status(204).send();
};
