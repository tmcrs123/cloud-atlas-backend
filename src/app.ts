import fastify, { FastifyBaseLogger, FastifyInstance } from "fastify";

import { fastifyAwilixPlugin } from "@fastify/awilix";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import ScalarApiReference from "@scalar/fastify-api-reference";
import { createContainer } from "awilix";
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { randomUUID } from "node:crypto";
import http from "node:http";
import { errorHandler } from "./errors/errorHandler.js";
import { resolveImagesDiConfig } from "./modules/images/config/images-config.js";
import { getImagesRoutes } from "./modules/images/routes/images-routes.js";
import { resolveMapsDiConfig } from "./modules/maps/config/index.js";
import { getMapsRoutes } from "./modules/maps/routes/index.js";
import { resolveMarkersDiConfig } from "./modules/markers/config/index.js";
import { getMarkersRoutes } from "./modules/markers/routes/index.js";
import { fakeJwtPlugin, verifyJwtTokenPlugin } from "./plugins/index.js";
import {
  AppConfig,
  resolveAppDiConfig,
  resolveDatabaseDiConfig,
  resolveLogger,
} from "./shared/configs/index.js";
import { Routes } from "./shared/types/index.js";
import { createJwksClient } from "./utils/index.js";
import {
  resolveQueueDiConfig,
  resolveTopicDiConfig,
} from "./infrastructure/queue/config/index.js";
import { QueueService } from "./infrastructure/queue/interfaces/index.js";
import fastifyCors from "@fastify/cors";

export async function getApp(): Promise<FastifyInstance> {
  const appConfig = new AppConfig();
  const app: FastifyInstance<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    FastifyBaseLogger
  > = fastify({
    loggerInstance: resolveLogger({
      logLevel: appConfig.configurations.logLevel,
    }),
    genReqId: () => randomUUID(),
  });

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

  diContainer.register({ ...resolveAppDiConfig() }); //inject APP_Config as dependency. This the only file where I accept referencing the APP_CONFIG const

  diContainer.register({
    ...resolveDatabaseDiConfig({ engine: "dynamoDb" }),
  });
  diContainer.register({
    ...resolveMapsDiConfig(),
  });
  diContainer.register({
    ...resolveMarkersDiConfig(),
  });
  diContainer.register({
    ...resolveImagesDiConfig(),
  });
  diContainer.register({
    ...resolveQueueDiConfig(),
  });
  diContainer.register({
    ...resolveTopicDiConfig(),
  });

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
          url: appConfig.getURL(),
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

  const jwtConfig = (() => {
    if (appConfig.isLocalEnv()) {
      return { secret: appConfig.configurations.jwtPublicKey };
    } else {
      return {
        secret: {
          public: async () => {
            const jwt_client = createJwksClient(
              appConfig.configurations.publicKeyURI
            );
            const keys = await jwt_client.getSigningKeys();
            //aws gives 2 keys, one old, other current. Use any to validate the tokens
            return keys[0].getPublicKey();
          },
        },
      };
    }
  })();

  await app.register(fastifyJwt, { ...jwtConfig });

  if (appConfig.isLocalEnv()) await app.register(fakeJwtPlugin);

  await app.register(verifyJwtTokenPlugin, {
    skipList: new Set([
      "/",
      "/healthcheck",
      "/favicon.ico",
      "/login",
      "/access-token",
      "/refresh-token",
      "/documentation",
      "/reference/",
      "/reference/js/scalar.js",
      "/reference/openapi.json",
    ]),
  });

  await app.register(fastifyCors, {
    origin: "*",
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Accept",
      "Content-Type",
      "Authorization",
    ],
    exposedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
    ],
  });

  // Add schema validator and serializer - this is what enables ZOD to do type checking on requests
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // this is the global error handler. By default catches ALL uncaught errors
  app.setErrorHandler(errorHandler);

  // routes
  // after means after ALL plugins are loaded
  app.after(() => {
    const { routes } = getRoutes();
    for (const route of routes) {
      app.withTypeProvider<ZodTypeProvider>().route(route);
    }
  });

  if (!appConfig.isLocalEnv())
    (diContainer.cradle.queue as QueueService).startPolling();

  return app;
}

function getRoutes(): {
  routes: Routes;
} {
  const { routes: mapsRoutes } = getMapsRoutes();
  const { routes: markersRoutes } = getMarkersRoutes();
  const { routes: imagesRoutes } = getImagesRoutes();

  return {
    routes: [
      ...mapsRoutes,
      ...markersRoutes,
      ...imagesRoutes,
      {
        method: "GET",
        url: "/healthcheck",
        handler: (req, rep) => rep.status(200).send("ok"),
      },
    ],
  };
}
