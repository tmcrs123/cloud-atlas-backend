import fastify, { type FastifyBaseLogger, type FastifyInstance } from 'fastify'

import { randomUUID } from 'node:crypto'
import type http from 'node:http'
import { fastifyAwilixPlugin } from '@fastify/awilix'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { createContainer } from 'awilix'
import fastifyGracefulShutdown from 'fastify-graceful-shutdown'
import { type ZodTypeProvider, createJsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod'
import { errorHandler } from './errors/errorHandler.js'
import { resolveQueueDiConfig } from './infrastructure/queue/config/queue-config.js'
import type { QueueService } from './infrastructure/queue/interfaces/queue.js'
import { resolveSecretsDiConfig } from './infrastructure/secrets/config/secrets-config.js'
import { resolveTopicDiConfig } from './infrastructure/topic/config/topic-config.js'
import { resolveDomainDiConfig } from './modules/domain/domain-config.js'
import { resolveImagesDiConfig } from './modules/images/config/images-config.js'
import { getImagesRoutes } from './modules/images/routes/images-routes.js'
import { resolveMarkersDiConfig } from './modules/markers/config/markers-config.js'
import { getMarkersRoutes } from './modules/markers/routes/markers-routes.js'
import { fakeJwtPlugin } from './plugins/fakeJwtPlugin.js'
import { verifyJwtTokenPlugin } from './plugins/verifyJwtTokenPlugin.js'
import { AppConfig, resolveAppDiConfig } from './shared/configs/app-config.js'
import { resolveDatabaseDiConfig } from './shared/configs/database-config.js'
import { resolveLogger } from './shared/configs/logger-config.js'
import type { Routes } from './shared/types/common-types.js'
import { createJwksClient } from './utils/jwt.js'
import { resolveAtlasDiConfig } from './modules/atlas/config/atlas-config.js'
import { getAtlasRoutes } from './modules/atlas/routes/atlas-routes.js'

export async function getApp(): Promise<FastifyInstance> {
  const appConfig = new AppConfig()
  const app: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse, FastifyBaseLogger> = fastify({
    loggerInstance: resolveLogger({
      logLevel: appConfig.configurations.logLevel,
    }),
    genReqId: () => randomUUID(),
  })

  //IOC
  const diContainer = createContainer({ injectionMode: 'PROXY', strict: true })
  await app.register(fastifyAwilixPlugin, {
    container: diContainer,
    disposeOnClose: true,
    asyncDispose: true,
    asyncInit: true,
    eagerInject: true,
    disposeOnResponse: false,
  })

  diContainer.register({ ...resolveAppDiConfig() }) //inject APP_Config as dependency. This the only file where I accept referencing the APP_CONFIG const

  diContainer.register({
    ...resolveDatabaseDiConfig({ engine: 'dynamoDb' }),
  })
  diContainer.register({
    ...resolveAtlasDiConfig(),
  })
  diContainer.register({
    ...resolveMarkersDiConfig(),
  })
  diContainer.register({
    ...resolveImagesDiConfig(appConfig.isLocalEnv()),
  })
  diContainer.register({
    ...resolveDomainDiConfig(appConfig.isLocalEnv()),
  })
  diContainer.register({
    ...resolveQueueDiConfig(),
  })
  diContainer.register({
    ...resolveTopicDiConfig(),
  })
  diContainer.register({
    ...resolveSecretsDiConfig(),
  })

  await app.register(fastifySwagger, {
    transform: createJsonSchemaTransform({ skipList: [] }),
    openapi: {
      info: {
        title: 'CloudAtlasAPi',
        description: 'The API for the Cloud Atlas project',
        version: '1.0.0',
      },
      servers: [
        {
          url: appConfig.getURL(),
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  })

  await app.register(ScalarApiReference, {
    routePrefix: '/reference',
  })
  app.get('/openapi.json', { schema: { hide: true } }, () => {
    return app.swagger()
  })

  const jwtConfig = (() => {
    if (appConfig.isLocalEnv()) {
      return { secret: appConfig.configurations.jwtPublicKey }
    }
    return {
      secret: {
        public: async () => {
          const jwt_client = createJwksClient(appConfig.configurations.publicKeyURI)
          const keys = await jwt_client.getSigningKeys()
          //aws gives 2 keys, one old, other current. Use any to validate the tokens
          return keys[0].getPublicKey()
        },
      },
    }
  })()

  await app.register(fastifyJwt, { ...jwtConfig })

  if (appConfig.isLocalEnv()) await app.register(fakeJwtPlugin(appConfig.configurations.userId))

  await app.register(verifyJwtTokenPlugin, {
    skipList: new Set(['/', '/healthcheck', '/favicon.ico', '/login', '/access-token', '/refresh-token', '/documentation', '/reference/', '/reference/js/scalar.js', '/reference/openapi.json']),
  })

  await app.register(fastifyCors, {
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
    exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 'Access-Control-Allow-Headers'],
  })

  if (!appConfig.isLocalEnv()) {
    await app.register(fastifyGracefulShutdown, {
      resetHandlersOnInit: true,
      timeout: appConfig.configurations.gracefulShutdownTimeoutInMs,
    })
  }

  await app.register(
    fastifyHelmet,
    appConfig.isLocalEnv()
      ? {
          contentSecurityPolicy: false,
        }
      : {},
  )

  // Add schema validator and serializer - this is what enables ZOD to do type checking on requests
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // this is the global error handler. By default catches ALL uncaught errors
  app.setErrorHandler(errorHandler)

  // routes
  // after means after ALL plugins are loaded
  app.after(() => {
    const { routes } = getRoutes(appConfig.isLocalEnv())
    for (const route of routes) {
      app.withTypeProvider<ZodTypeProvider>().route(route)
    }
  })

  if (!appConfig.isLocalEnv()) (diContainer.cradle.queue as QueueService).startPolling()

  return app
}

function getRoutes(isLocalEnv: boolean): {
  routes: Routes
} {
  const { routes: atlasRoutes } = getAtlasRoutes()
  const { routes: markersRoutes } = getMarkersRoutes()
  const { routes: imagesRoutes } = getImagesRoutes(isLocalEnv)

  return {
    routes: [
      ...atlasRoutes,
      ...markersRoutes,
      ...imagesRoutes,
      {
        method: 'GET',
        url: '/healthcheck',
        handler: (_req, rep) => rep.status(200).send('ok'),
      },
    ],
  }
}
