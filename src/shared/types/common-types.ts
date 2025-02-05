import type { FastifyBaseLogger, FastifySchema, RouteOptions } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import type http from 'node:http'

// Utils
export type RequiredNonOptional<T> = Required<
  Pick<
    T,
    {
      [K in keyof T]: T extends Record<K, T[K]> ? K : never
    }[keyof T]
  >
>

// Routes
export type Routes = Array<
  RouteOptions<
    http.Server,
    http.IncomingMessage,
    http.ServerResponse,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any,
    FastifySchema,
    ZodTypeProvider,
    FastifyBaseLogger
  >
>

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'

// JWT
export type JwtPublicKey = {
  alg: string
  e: string
  kid: string
  kty: string
  n: string
  use: string
}

export type AppMessage = {
  id: string
  receiptHandle?: string | undefined
  body?: string | undefined
  description?: string | undefined
}
