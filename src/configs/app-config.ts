import { LogLevel } from "fastify"

export type AppConfig = {
    port: number
    bindAddress: string
    jwtPublicKey: string
    logLevel: LogLevel
    nodeEnv: 'production' | 'development' | 'test'
    appEnv: 'production' | 'development' | 'staging'
    appVersion: string
    gitCommitSha: string
    baseUrl: string
    metrics: {
      isEnabled: boolean
    }
  }
