import { type Resolver, asClass } from 'awilix'
import type { LogLevel } from 'fastify'
import { ENVIRONMENT } from '../../environment.js'
import { MissingConfigError } from '../../errors/missing-config-error.js'
import { parseBoolean } from '../../utils/parse-boolean.js'

export type Configurations = {
  atlasTableName: string
  bindAddress: string
  databaseAccessKeyId: string
  databaseEndpoint: string
  databaseSecretAccessKey: string
  domain: string
  environment: string
  gracefulShutdownTimeoutInMs: number
  imagesTableLSIName: string
  imagesTableName: string
  infrastructureEndpoint: string
  jwtPublicKey: string | undefined
  logLevel: LogLevel
  markersTableName: string
  optimizedPhotoDistributionUrl: string
  optimizedPhotosKeypairId: string
  optimizedPhotosPrivateKeyName: string
  ownersTableLSIName: string
  ownersTableName: string
  port: number
  protocol: string
  publicKeyURI: string
  queueEnabled: boolean
  queueMaxMessages: number
  queuePollingInterval: number
  queueURL: string
  queueWaitTimeSeconds: number
  region: string
  s3DumpBucketName: string
  s3OptimizedBucketName: string
  s3PresignedUrlExpirationInSeconds: number
  subdomain: string
  topicARN: string
  topicEnabled: boolean
  userId: string | undefined
}

export class AppConfig {
  configurations: Configurations

  constructor() {
    try {
      this.configurations = {
        atlasTableName: ENVIRONMENT.ATLAS_TABLE_NAME,
        bindAddress: ENVIRONMENT.BIND_ADDRESS,
        databaseAccessKeyId: ENVIRONMENT.DATABASE_ACCESS_KEY_ID || 'onlyUsedInDockerLocal',
        databaseEndpoint: ENVIRONMENT.DATABASE_ENDPOINT || 'onlyUsedForLocalDevelopment',
        databaseSecretAccessKey: ENVIRONMENT.DATABASE_SECRET_ACCESS_KEY || 'onlyUsedInDockerLocal',
        domain: ENVIRONMENT.DOMAIN,
        environment: ENVIRONMENT.ENVIRONMENT,
        gracefulShutdownTimeoutInMs: Number.parseInt(ENVIRONMENT.GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS),
        infrastructureEndpoint: ENVIRONMENT.INFRASTRUCTURE_ENDPOINT || 'onlyUsedForLocalDevelopment',
        imagesTableLSIName: ENVIRONMENT.IMAGES_TABLE_LSI_NAME,
        imagesTableName: ENVIRONMENT.IMAGES_TABLE_NAME,
        jwtPublicKey: ENVIRONMENT.JWT_PUBLIC_KEY,
        logLevel: ENVIRONMENT.LOG_LEVEL,
        markersTableName: ENVIRONMENT.MARKERS_TABLE_NAME,
        optimizedPhotoDistributionUrl: ENVIRONMENT.OPTIMIZED_PHOTOS_DISTRIBUTION_URL,
        optimizedPhotosKeypairId: ENVIRONMENT.OPTIMIZED_PHOTOS_KEYPAIR_ID,
        optimizedPhotosPrivateKeyName: ENVIRONMENT.OPTIMIZED_PHOTOS_PRIVATE_KEY_NAME,
        ownersTableLSIName: ENVIRONMENT.OWNERS_TABLE_LSI_NAME,
        ownersTableName: ENVIRONMENT.OWNERS_TABLE_NAME,
        port: Number.parseInt(ENVIRONMENT.PORT),
        protocol: ENVIRONMENT.PROTOCOL,
        publicKeyURI: ENVIRONMENT.PUBLIC_KEY_URI,
        queueEnabled: parseBoolean(ENVIRONMENT.QUEUE_ENABLED),
        queueMaxMessages: Number.parseInt(ENVIRONMENT.QUEUE_MAX_NUM_MESSAGES),
        queuePollingInterval: Number.parseInt(ENVIRONMENT.QUEUE_POLLING_INTERVAL),
        queueURL: ENVIRONMENT.QUEUE_URL,
        queueWaitTimeSeconds: Number.parseInt(ENVIRONMENT.QUEUE_WAIT_TIME_SECONDS),
        region: ENVIRONMENT.REGION,
        s3DumpBucketName: ENVIRONMENT.DUMP_BUCKET_NAME,
        s3OptimizedBucketName: ENVIRONMENT.OPTIMIZED_BUCKET_NAME,
        s3PresignedUrlExpirationInSeconds: Number.parseInt(ENVIRONMENT.PRESIGNED_URL_EXPIRATION_IN_SECONDS),
        subdomain: ENVIRONMENT.SUBDOMAIN,
        topicARN: ENVIRONMENT.TOPIC_ARN,
        topicEnabled: parseBoolean(ENVIRONMENT.TOPIC_ENABLED),
        userId: ENVIRONMENT.USER_ID,
      }
    } catch (error: unknown) {
      throw new MissingConfigError((error as Error).message, 500)
    }
  }

  isLocalEnv = () => this.configurations.environment === 'local'

  getURL = () => {
    if (this.isLocalEnv()) return `${this.configurations.protocol}://${this.configurations.domain}:${this.configurations.port}`
    return `${this.configurations.protocol}://${this.configurations.subdomain}.${this.configurations.domain}:${this.configurations.port}`
  }
}

type AppDiConfig = Record<'appConfig', Resolver<AppConfig>>

export function resolveAppDiConfig(): AppDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: 'SINGLETON' }),
  }
}
