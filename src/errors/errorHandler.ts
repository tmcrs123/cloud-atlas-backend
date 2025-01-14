import { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import { DatabaseGenericError } from "./index.js";

const knownAuthErrors = new Set([
  "FST_JWT_NO_AUTHORIZATION_IN_HEADER",
  "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED",
  "FST_JWT_AUTHORIZATION_TOKEN_INVALID",
]);

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // ZOD ERRORS
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      error: "Response Validation Error",
      message: "Request doesn't match the schema",
      statusCode: 400,
      details: {
        issues: error.validation,
        method: request.method,
        url: request.url,
      },
    });
  }

  if (isResponseSerializationError(error)) {
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Response doesn't match the schema",
      statusCode: 500,
      details: {
        issues: error.cause.issues,
        method: error.method,
        url: error.url,
      },
    });
  }

  //AUTH ERRORS
  if (knownAuthErrors.has(error.code)) {
    return reply.code(401).send({
      error: error.code,
      message: error.message,
      statusCode: 401,
    });
  }

  //Database ERRORS
  if (error instanceof DatabaseGenericError) {
    let err = {
      error: "DATABASE_ERROR",
      message: error.message,
      statusCode: error.statusCode,
    };

    return reply.code(error.statusCode).send(err);
  }

  //OTHER STUFF
  console.log("HANLDER", error);
  console.log("type", typeof error);
  JSON.stringify(error);
  return reply.code(500).send(error.message);
}
