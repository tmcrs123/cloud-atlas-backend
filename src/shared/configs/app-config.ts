import { asFunction, Resolver } from "awilix";
import { LogLevel } from "fastify";

export type AppConfig = {
  appVersion: string;
  baseUrl: string;
  environment: "production" | "local" | "test";
  logLevel: LogLevel;
  port: number;
  bindAddress: string;
  jwtPublicKey: string;
  publicKeyURI: string;
};

export const APP_CONFIG: AppConfig = {
  appVersion: valueOfFallback<AppConfig["appVersion"]>(
    process.env["APP_VERSION"],
    "test"
  ),
  baseUrl: valueOfFallback<AppConfig["baseUrl"]>(
    process.env["BASE_URL"],
    "localhost"
  ),
  environment: valueOfFallback<AppConfig["environment"]>(
    process.env["ENVIRONMENT"],
    "local"
  ),
  logLevel: valueOfFallback<AppConfig["logLevel"]>(
    process.env["LOG_LEVEL"],
    "info"
  ),
  port: valueOfFallback<AppConfig["port"]>(process.env["PORT"], 3000),
  bindAddress: valueOfFallback<AppConfig["bindAddress"]>(
    process.env["BIND_ADDRESS"],
    "0.0.0.0"
  ),
  jwtPublicKey: valueOfFallback<AppConfig["jwtPublicKey"]>(
    process.env["JWT_PUBLIC_KEY"],
    "super secret key"
  ),
  publicKeyURI: valueOfFallback<AppConfig["publicKeyURI"]>(
    process.env["PUBLIC_KEY_URI"],
    ""
  ),
};

export const isLocalEnv = () => APP_CONFIG.environment === "local";

export type AppConfigDependencies = {
  appConfig: AppConfig;
};

type AppDiConfig = Record<keyof AppConfigDependencies, Resolver<AppConfig>>;

export type AppInjectableDependencies = AppConfigDependencies;

export function resolveAppDiConfig(): AppDiConfig {
  return {
    appConfig: asFunction(
      () => {
        return {
          port: APP_CONFIG.port,
          bindAddress: APP_CONFIG.bindAddress,
          logLevel: APP_CONFIG.logLevel,
          environment: APP_CONFIG.environment,
          appVersion: APP_CONFIG.appVersion,
          baseUrl: APP_CONFIG.baseUrl,
          jwtPublicKey: APP_CONFIG.jwtPublicKey,
          publicKeyURI: APP_CONFIG.publicKeyURI,
        };
      },
      { lifetime: "SINGLETON" }
    ),
  };
}

function valueOfFallback<T>(value: unknown, fallback: T) {
  return value ? (value as T) : (fallback as T);
}
