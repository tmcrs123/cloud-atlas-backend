import { FastifyReply, FastifyRequest } from "fastify";
import { AppConfig } from "../../../shared/configs/index.js";
import { DomainService } from "../../domain/services/index.js";
import {
  CreateMarkersRequestBody,
  CreateMarkersRequestParams,
  DeleteMarkerRequestParams,
  DeleteMarkersRequestBody,
  DeleteMarkersRequestParams,
  DeleteMarkersRequestQueryString,
  GetMarkerRequestParams,
  GetMarkersRequestParams,
  UpdateMarkerRequestBody,
  UpdateMarkerRequestParams,
} from "../schemas/index.js";

export const createMarkers = async (
  request: FastifyRequest<{
    Body: CreateMarkersRequestBody;
    Params: CreateMarkersRequestParams;
  }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");
  const appConfig = request.diScope.resolve<AppConfig>("appConfig");

  const { mapId } = request.params;

  let markers = await domainService.createMarkers(
    request.body,
    request.params.mapId
  );

  return reply
    .status(201)
    .header("Location", `${appConfig.getURL()}/markers/${mapId}`)
    .send({ markers });
};

export const getMarker = async (
  request: FastifyRequest<{ Params: GetMarkerRequestParams }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let marker = await domainService.getMarker(
    request.params.mapId,
    request.params.markerId
  );

  if (!marker) return reply.status(404).send();
  return reply.status(200).send(marker);
};

export const getMarkers = async (
  request: FastifyRequest<{ Params: GetMarkersRequestParams }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  let markers = await domainService.getMarkers(request.params.mapId);

  return reply.status(200).send({ markers });
};

export const deleteMarker = async (
  request: FastifyRequest<{ Params: DeleteMarkerRequestParams }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  await domainService.deleteMarker(
    request.params.markerId,
    request.params.mapId
  );

  return reply.status(204).send();
};

export const deleteMarkers = async (
  request: FastifyRequest<{
    Params: DeleteMarkersRequestParams;
    Body: DeleteMarkersRequestBody;
    Querystring: DeleteMarkersRequestQueryString;
  }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  await domainService.deleteMarkers(
    request.body.markerIds,
    request.params.mapId,
    request.query.all
  );

  return reply.status(204).send();
};

export const updateMarker = async (
  request: FastifyRequest<{
    Body: UpdateMarkerRequestBody;
    Params: UpdateMarkerRequestParams;
  }>,
  reply: FastifyReply
) => {
  const domainService = request.diScope.resolve<DomainService>("domainService");

  const response = await domainService.updateMarker(
    request.body,
    request.params.markerId,
    request.params.mapId
  );

  if (!response) return reply.status(204).send();

  return reply.status(200).send(response);
};
