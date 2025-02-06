import { z } from 'zod'

const environmentVariables = z.object({
  ATLAS_TABLE_NAME: z.string(),
  BIND_ADDRESS: z.string(),
  DATABASE_ACCESS_KEY_ID: z.string(),
  DATABASE_ENDPOINT: z.string(),
  DATABASE_SECRET_ACCESS_KEY: z.string(),
  DOMAIN: z.string(),
  DUMP_BUCKET_NAME: z.string(),
  ENVIRONMENT: z.string(),
  GRACEFUL_SHUTDOWN_TIMEOUT_IN_MSECS: z.string(),
  INFRASTRUCTURE_ENDPOINT: z.string(),
  IMAGES_TABLE_LSI_NAME: z.string(),
  IMAGES_TABLE_NAME: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  LOG_LEVEL: z.enum(['debug', 'error', 'info']),
  MARKERS_TABLE_NAME: z.string(),
  OPTIMIZED_BUCKET_NAME: z.string(),
  OPTIMIZED_PHOTOS_DISTRIBUTION_URL: z.string(),
  OPTIMIZED_PHOTOS_KEYPAIR_ID: z.string(),
  OPTIMIZED_PHOTOS_PRIVATE_KEY_NAME: z.string(),
  OWNERS_TABLE_LSI_NAME: z.string(),
  OWNERS_TABLE_NAME: z.string(),
  PORT: z.string(),
  PRESIGNED_URL_EXPIRATION_IN_SECONDS: z.string(),
  PROTOCOL: z.string(),
  PUBLIC_KEY_URI: z.string(),
  QUEUE_ENABLED: z.string(),
  QUEUE_MAX_NUM_MESSAGES: z.string(),
  QUEUE_POLLING_INTERVAL: z.string(),
  QUEUE_URL: z.string(),
  QUEUE_WAIT_TIME_SECONDS: z.string(),
  REGION: z.string(),
  SUBDOMAIN: z.string(),
  TOPIC_ARN: z.string(),
  TOPIC_ENABLED: z.string(),
  TOPIC_URL: z.string(),
  USER_ID: z.string(),
})

export const ENVIRONMENT = environmentVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof environmentVariables> {}
  }
}
