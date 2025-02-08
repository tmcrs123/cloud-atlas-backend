import type { FastifyPluginCallback } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

export const fakeJwtPlugin: (fakeUserId: string, fakeUserEmail: string) => FastifyPluginCallback = (fakeUserId, fakeUserEmail) =>
  fastifyPlugin(
    // biome-ignore lint/correctness/noEmptyPattern: <explanation>
    (app, {}, next) => {
      app.addHook('onRequest', (req, _reply, done) => {
        req.user = { sub: fakeUserId, email: fakeUserEmail }
        return done()
      })
      next()
    },
    { name: 'fake-jwt-plugin' },
  )
