import { JWT } from "@fastify/jwt";
import { FastifyPluginCallback } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { generateJwtToken } from "../utils/index.js";
import { randomUUID } from "node:crypto";

export const fakeJwtPlugin: FastifyPluginCallback = fastifyPlugin(
  (app, {}, next) => {
    app.addHook("onRequest", (req, reply, done) => {
      const fakeToken = generateJwtToken(app.jwt, {
        sub: randomUUID(),
        email: "some_email@test.com",
      });
      req.headers.authorization = `Bearer ${fakeToken}`;
      return done();
    });
    next();
  },
  { name: "fake-jwt-plugin" }
);
