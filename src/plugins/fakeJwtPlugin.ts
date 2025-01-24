import { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { generateJwtToken } from "../utils/index.js";

export const fakeJwtPlugin: (fakeUserId: string) => FastifyPluginCallback = (
  fakeUserId
) =>
  fastifyPlugin(
    (app, {}, next) => {
      app.addHook("onRequest", (req, reply, done) => {
        const fakeToken = generateJwtToken(app.jwt, {
          sub: fakeUserId,
          email: "some_email@test.com",
        });
        req.headers.authorization = `Bearer ${fakeToken}`;
        return done();
      });
      next();
    },
    { name: "fake-jwt-plugin" }
  );
