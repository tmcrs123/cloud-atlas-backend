import { FastifyReply, FastifyRequest } from "fastify";
import {
  CreateMarkerRequestBody,
  CreateMarkerRequestParams,
  DeleteMarkerRequestParams,
  GetMarkerRequestParams,
  Marker,
  UpdateMarkerRequestBody,
  UpdateMarkerRequestParams,
} from "../schemas/index.js";
import { MarkersService } from "../services/index.js";
import { AppConfig } from "../../../shared/configs/index.js";

export const createMarker = async (
  request: FastifyRequest<{
    Body: CreateMarkerRequestBody;
    Params: CreateMarkerRequestParams;
  }>,
  reply: FastifyReply
): Promise<Partial<Marker>> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  const { mapId } = request.params;

  let marker = await markersService.createMarker(
    request.body,
    request.params.mapId
  );

  return reply
    .status(201)
    .header(
      "Location",
      `${appConfig.getURL()}/maps/${mapId}/markers/${marker.id}`
    )
    .send(marker);
};

export const createManyMarkers = async (
  request: FastifyRequest<{
    Body: CreateMarkerRequestBody[];
    Params: CreateMarkerRequestParams;
  }>,
  reply: FastifyReply
): Promise<Partial<Marker>[]> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  const { mapId } = request.params;

  let markers = await markersService.createManyMarkers(
    request.body,
    request.params.mapId
  );

  return reply
    .status(201)
    .header("Location", `${appConfig.getURL()}/markers/${mapId}`)
    .send(markers);
};

export const getMarker = async (
  request: FastifyRequest<{ Params: GetMarkerRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  let marker = await markersService.getMarker(request.params.id);

  if (!marker) return reply.status(404).send();
  return reply.status(200).send(marker);
};

export const getMarkersForMap = async (
  request: FastifyRequest<{ Params: { mapId: string } }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  let markers = await markersService.getMarkersForMap(request.params.mapId);

  return reply.status(200).send(markers);
};

export const deleteMarker = async (
  request: FastifyRequest<{ Params: DeleteMarkerRequestParams }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  await markersService.deleteMarker(request.params.id, request.params.mapId);

  return reply.status(204).send();
};

export const updateMarker = async (
  request: FastifyRequest<{
    Body: UpdateMarkerRequestBody;
    Params: UpdateMarkerRequestParams;
  }>,
  reply: FastifyReply
): Promise<void> => {
  const markersService =
    request.diScope.resolve<MarkersService>("markersService");

  const response = await markersService.updateMarker(
    request.params.id,
    request.params.mapId,
    request.body
  );
  if (!response) return reply.status(204).send();
  return reply.status(200).send(response);
};
