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

export type LogLevel =
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "silent";

// JWT
export type JwtPublicKey = {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
};
