import fastify, {
  FastifyBaseLogger,
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

import http from "node:http";
import { resolveLogger } from "./configs/logger-config";
import InternalError from "./errors/internal-error";
import { createContainer } from "awilix";
import { resolveMapsDiConfig } from "./modules/maps/config/maps-di";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { Routes } from "./shared/common-types";
import { getMapsRoutes } from "./modules/maps/routes/maps-routes";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

export async function getApp(): Promise<FastifyInstance> {
  const app: FastifyInstance<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    FastifyBaseLogger
  > = fastify({ loggerInstance: resolveLogger({ logLevel: "info" }) });

  // Add schema validator and serializer
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  //IOC
  const diContainer = createContainer({ injectionMode: "PROXY", strict: true });
  await app.register(fastifyAwilixPlugin, {
    container: diContainer,
    disposeOnClose: true,
    asyncDispose: true,
    asyncInit: true,
    eagerInject: true,
    disposeOnResponse: false,
  });
  diContainer.register({ ...resolveMapsDiConfig({engine: "dynamoDb"}) });

  // this is the global error handler. By default catches ALL uncaught errors
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    console.log(JSON.stringify(error));
    return reply.status(500).send(error.message)
  });

  // routes
  // after means after ALL plugins are loaded
  app.after(() => {
    const { routes } = getRoutes();
    for (const route of routes) {
      app.withTypeProvider<ZodTypeProvider>().route(route);
    }
  });

  return app;
}

function getRoutes(): {
  routes: Routes;
} {
  const { routes: mapsRoutes } = getMapsRoutes();

  return {
    routes: [...mapsRoutes],
  };
}
