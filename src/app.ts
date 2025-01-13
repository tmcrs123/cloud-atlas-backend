import fastify, {
  FastifyBaseLogger,
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";

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
import { SigningKey } from "jwks-rsa";
import { randomUUID } from "node:crypto";
import http from "node:http";
import { resolveMapsDiConfig } from "./modules/maps/config/index.js";
import { getMapsRoutes } from "./modules/maps/routes/index.js";
import { fakeJwtPlugin } from "./plugins/index.js";
import { verifyJwtTokenPlugin } from "./plugins/index.js";
import {
  APP_CONFIG,
  isLocalEnv,
  resolveAppDiConfig,
  resolveDatabaseDiConfig,
} from "./shared/configs/index.js";
import { resolveLogger } from "./shared/configs/index.js";
import { Routes } from "./shared/types/index.js";
import { createJwksClient } from "./utils/index.js";

export async function getApp(): Promise<FastifyInstance> {
  const app: FastifyInstance<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    FastifyBaseLogger
  > = fastify({
    loggerInstance: resolveLogger({ logLevel: APP_CONFIG.logLevel }),
    genReqId: () => randomUUID(),
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
    ...resolveMapsDiConfig(diContainer.cradle.databaseConfig),
  });

  const jwtConfig = (() => {
    if (isLocalEnv()) {
      return { secret: APP_CONFIG.jwtPublicKey };
    } else {
      return {
        secret: {
          public: async () => {
            const jwt_client = createJwksClient(APP_CONFIG.publicKeyURI);
            const keys = await jwt_client.getSigningKeys();
            //aws gives 2 keys, one old, other current. Use any to validate the tokens
            return keys[0].getPublicKey();
          },
        },
      };
    }
  })();

  await app.register(fastifyJwt, { ...jwtConfig });

  if (isLocalEnv()) await app.register(fakeJwtPlugin);

  await app.register(verifyJwtTokenPlugin, {
    skipList: new Set([
      "/",
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

  // Add schema validator and serializer - this is what enables ZOD to do type checking on requests
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

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
