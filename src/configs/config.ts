import { AppConfig } from "./app-config";
import { DatabaseConfig } from "./database-config";
import { LoggerConfig } from "./logger-config";

export type Config = {
    appConfig: AppConfig;
    loggerConfig: LoggerConfig;
    databaseConfig: DatabaseConfig
}
