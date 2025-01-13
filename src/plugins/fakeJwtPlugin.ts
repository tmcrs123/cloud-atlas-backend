import { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { randomUUID } from "node:crypto";
import { generateJwtToken } from "../utils/index.js";

const fakeId = randomUUID();

export const fakeJwtPlugin: FastifyPluginCallback = fastifyPlugin(
  (app, {}, next) => {
    app.addHook("onRequest", (req, reply, done) => {
      const fakeToken = generateJwtToken(app.jwt, {
        sub: fakeId,
        email: "some_email@test.com",
      });
      req.headers.authorization = `Bearer ${fakeToken}`;
      return done();
    });
    next();
  },
  { name: "fake-jwt-plugin" }
);
