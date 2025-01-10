import {
  FastifyBaseLogger,
  FastifySchema,
  FastifySchemaCompiler,
  RouteOptions,
} from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import type http from "node:http";

// Routes
export type Routes = Array<
  RouteOptions<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    any,
    any,
    FastifySchema,
    ZodTypeProvider,
    FastifyBaseLogger
  >
>;
