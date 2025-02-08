import type { FastifyInstance, FastifyPluginCallback, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export type JwtTokenPluginOptions = {
  skipList: Set<string>
}

interface User {
  sub: string
  email: string
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: User
  }
}

/**
 * this is a bit weird but the way it works is:
 *
 * you import fastifyPlugin which the fn that tells fastify you want to register a plugin
 *
 * that fn takes the app instance, any options you want to define and the next fn. The purpose of the next fn is to tell fastify the plugin registration process is finished
 *
 * the first argument of the fastifyPlugin function is your handler function, meaning, what and when you want the plugin to run. In this case it's on every request
 * the second argument of the fastifyPlugin function is just some options
 *
 * the done() fn is your way of saying the you're done with the hook and you want to let the request on to whatever plugins/controllers you have.
 */
export const verifyJwtTokenPlugin: FastifyPluginCallback<JwtTokenPluginOptions> = fastifyPlugin<JwtTokenPluginOptions>(
  (app: FastifyInstance, options: JwtTokenPluginOptions, next: (err?: Error) => void) => {
    app.addHook('onRequest', (req: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
      if (req.method === 'OPTIONS') return done()
      if (req.routeOptions.url && options.skipList.has(req.routeOptions.url)) return done()

      req
        .jwtVerify({ algorithms: ['RS256'] })
        .then(() => done())
        .catch((err) => done(err))
    })

    next()
  },
  { name: 'jwt-token-plugin' },
)
