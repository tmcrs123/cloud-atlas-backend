import fastify, {
  FastifyBaseLogger,
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  HookHandlerDoneFunction,
} from "fastify";

import http from "node:http";
import { resolveLogger } from "./shared/configs/logger-config";
import InternalError from "./errors/internal-error";
import { createContainer } from "awilix";
import { resolveMapsDiConfig } from "./modules/maps/config/maps-di";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { Routes } from "./shared/common-types";
import { getMapsRoutes } from "./modules/maps/routes/maps-routes";
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { randomUUID } from "node:crypto";
import { resolveAppDiConfig, resolveDatabaseDiConfig } from "./shared/configs";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";

export async function getApp(): Promise<FastifyInstance> {
  const app: FastifyInstance<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    FastifyBaseLogger
  > = fastify({
    loggerInstance: resolveLogger({ logLevel: "info" }),
    genReqId: () => randomUUID(),
    requestIdHeader: "x-request-id",
  });

  app.addHook("onSend", (request, reply, payload, done) => {
    // Add the requestId to the response headers
    reply.header("x-request-id", request.id);
    done();
  });

  app.get("/bnanaas", () => {});

  await app.register(fastifySwagger, {
    transform: createJsonSchemaTransform({ skipList: [] }),
    openapi: {
      info: {
        title: "SampleApi",
        description: "Sample backend service",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  await app.register(ScalarApiReference, {
    routePrefix: "/reference",
  });
  app.get("/openapi.json", { schema: { hide: true } }, () => {
    return app.swagger();
  });

  // Add schema validator and serializer - this is what enables ZOD to do type checking on requests
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

  diContainer.register({ ...resolveAppDiConfig() });
  diContainer.register({ ...resolveDatabaseDiConfig({ engine: "dynamoDb" }) });
  diContainer.register({
    ...resolveMapsDiConfig(diContainer.cradle.databaseConfig),
  });

  // this is the global error handler. By default catches ALL uncaught errors
  app.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      return reply.status(500).send(error.message);
    }
  );

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
