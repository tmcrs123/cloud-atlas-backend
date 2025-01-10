import { FastifyBaseLogger } from "fastify";
import pino, { redactOptions } from "pino";
import { LogLevel } from "./common-types";

const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  logLevel: "error",
};

export type LoggerConfig = {
  logLevel: LogLevel;
  redactOptions?: redactOptions;
};

export const resolveLogger = (
  loggerConfig: LoggerConfig = DEFAULT_LOGGER_CONFIG
) => {
  // This is all a bit weird but pino returns a pino.Logger that implements pino.BaseLogger. On the other hand FastifyBaseLogger implements pino.BaseLogger so casting to FastifyBaseLogger works
  return pino({ level: loggerConfig.logLevel, timestamp: true, crlf: true }) as FastifyBaseLogger;
};
