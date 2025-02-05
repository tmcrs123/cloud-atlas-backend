import type { AppConfig } from './app-config.js'
import type { DatabaseConfig } from './database-config.js'
import type { LoggerConfig } from './logger-config.js'

export type ServerConfig = {
  appConfig: AppConfig
  loggerConfig: LoggerConfig
  databaseConfig: DatabaseConfig
}
