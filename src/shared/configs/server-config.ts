import { AppConfig } from "./index.js";
import { DatabaseConfig } from "./index.js";
import { LoggerConfig } from "./index.js";

export type ServerConfig = {
  appConfig: AppConfig;
  loggerConfig: LoggerConfig;
  databaseConfig: DatabaseConfig;
};
