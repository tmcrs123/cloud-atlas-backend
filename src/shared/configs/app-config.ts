import { asClass, asFunction, Resolver } from "awilix";
import { LogLevel } from "fastify";
import { valueOfFallback } from "../../utils/index.js";

export type Configurations = {
  appVersion: string;
  baseUrl: string;
  environment: "production" | "local" | "test";
  logLevel: LogLevel;
  port: number;
  bindAddress: string;
  jwtPublicKey: string;
  publicKeyURI: string;
};

export class AppConfig {
  configurations: Configurations = {
    appVersion: valueOfFallback<Configurations["appVersion"]>(
      process.env["APP_VERSION"],
      "test"
    ),
    baseUrl: valueOfFallback<Configurations["baseUrl"]>(
      process.env["BASE_URL"],
      "localhost"
    ),
    environment: valueOfFallback<Configurations["environment"]>(
      process.env["ENVIRONMENT"],
      "local"
    ),
    logLevel: valueOfFallback<Configurations["logLevel"]>(
      process.env["LOG_LEVEL"],
      "info"
    ),
    port: valueOfFallback<Configurations["port"]>(process.env["PORT"], 3000),
    bindAddress: valueOfFallback<Configurations["bindAddress"]>(
      process.env["BIND_ADDRESS"],
      "0.0.0.0"
    ),
    jwtPublicKey: valueOfFallback<Configurations["jwtPublicKey"]>(
      process.env["JWT_PUBLIC_KEY"],
      "super secret key"
    ),
    publicKeyURI: valueOfFallback<Configurations["publicKeyURI"]>(
      process.env["PUBLIC_KEY_URI"],
      ""
    ),
  };

  isLocalEnv = () => this.configurations.environment === "local";
}

type AppDiConfig = Record<"appConfig", Resolver<AppConfig>>;

export function resolveAppDiConfig(): AppDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
  };
}
