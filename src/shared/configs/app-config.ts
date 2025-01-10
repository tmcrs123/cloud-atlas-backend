import { asFunction, Resolver } from "awilix";
import { LogLevel } from "fastify";

export type AppConfig = {
  appVersion: string;
  baseUrl: string;
  environment: "production" | "local" | "test";
  logLevel: LogLevel;
  port: number;
};

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
          port: valueOfFallback<AppConfig["port"]>(process.env["PORT"], 3000),
          logLevel: valueOfFallback<AppConfig["logLevel"]>(
            process.env["logLevel"],
            "error"
          ),
          environment: valueOfFallback<AppConfig["environment"]>(
            process.env["environment"],
            "local"
          ),
          appVersion: valueOfFallback<AppConfig["appVersion"]>(
            process.env["appVersion"],
            "latest"
          ),
          baseUrl: valueOfFallback<AppConfig["baseUrl"]>(
            process.env["baseUrl"],
            "localhost"
          ),
        };
      },
      { lifetime: "SINGLETON" }
    ),
  };
}

function valueOfFallback<T>(value: unknown, fallback: unknown) {
  return value ? (value as T) : (fallback as T);
}
