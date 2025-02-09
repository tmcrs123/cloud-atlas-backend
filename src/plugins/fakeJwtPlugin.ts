import type { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const fakeJwtPlugin: (fakeUserId: string) => FastifyPluginCallback = (fakeUserId) =>
  fastifyPlugin(
    // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    (app, {}, next) => {
      app.addHook('onRequest', (req, _reply, done) => {
        req.user = { sub: fakeUserId, email: 'someone@email.com' }
        return done()
      })
      next()
    },
    { name: 'fake-jwt-plugin' },
  )
