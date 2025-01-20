import { asClass, asFunction, Resolver } from "awilix";
import { LogLevel } from "fastify";
import { valueOrFallback } from "../../utils/index.js";

export type Configurations = {
  appVersion: string;
  awsConfig: AWSConfiguration;
  domain: string;
  databaseEndpoint: string;
  subdomain: string;
  bindAddress: string;
  environment: "production" | "local" | "test";
  jwtPublicKey: string;
  logLevel: LogLevel;
  port: number;
  publicKeyURI: string;
  protocol: string;
  infrastructureEndpoint: string;
  mapsTableName: string;
  imagesTableName: string;
  markersTableName: string;
};

export type AWSConfiguration = {
  region: string;
  queueURL: string;
  queueMaxMessages: number;
  queueWaitTimeSeconds: number;
  queuePollingInterval: number;
  s3DumpBucketName: string;
  s3OptimizedBucketName: string;
  s3PresignedUrlExpirationInSeconds: number;
  topicURL: string;
};

export class AppConfig {
  awsConfiguration: AWSConfiguration = {
    region: valueOrFallback<AWSConfiguration["region"]>(
      process.env["AWS_REGION"],
      "us-east-1"
    ),
    queueURL: valueOrFallback<AWSConfiguration["queueURL"]>(
      process.env["QUEUE_URL"],
      "http://sqs.us-east-1.localstack:4566/000000000000/snappin-queue"
    ),
    queueMaxMessages: valueOrFallback<AWSConfiguration["queueMaxMessages"]>(
      process.env["QUEUE_MAX_MESSAGES"],
      10
    ),
    queueWaitTimeSeconds: valueOrFallback<
      AWSConfiguration["queueWaitTimeSeconds"]
    >(process.env["QUEUE_WAIT_TIME_SECONDS"], 20),
    queuePollingInterval: valueOrFallback<
      AWSConfiguration["queuePollingInterval"]
    >(process.env["QUEUE_POLLING_INTERVAL"], 5000),
    s3DumpBucketName: valueOrFallback<AWSConfiguration["s3DumpBucketName"]>(
      process.env["S3_DUMP_BUCKET_NAME"],
      "dump"
    ),
    s3OptimizedBucketName: valueOrFallback<
      AWSConfiguration["s3OptimizedBucketName"]
    >(process.env["S3_OPTIMIZED_BUCKET_NAME"], "optimized"),
    topicURL: valueOrFallback<AWSConfiguration["topicURL"]>(
      process.env["TOPIC_URL"],
      "http://sns.us-east-1.localstack:4566/000000000000/snappin-topic"
    ),
    s3PresignedUrlExpirationInSeconds: valueOrFallback<
      AWSConfiguration["s3PresignedUrlExpirationInSeconds"]
    >(process.env["S3_PRESIGNED_URL_EXPIRATION_IN_SECONDS"], 300),
  };

  configurations: Configurations = {
    awsConfig: { ...this.awsConfiguration },
    appVersion: valueOrFallback<Configurations["appVersion"]>(
      process.env["APP_VERSION"],
      "test"
    ),
    databaseEndpoint: valueOrFallback<Configurations["databaseEndpoint"]>(
      process.env["DATABASE_ENDPOINT"],
      "http://localhost:8000"
    ),
    domain: valueOrFallback<Configurations["domain"]>(
      process.env["DOMAIN"],
      "localhost"
    ),
    subdomain: valueOrFallback<Configurations["subdomain"]>(
      process.env["SUBDOMAIN"],
      "subdomain"
    ),
    environment: valueOrFallback<Configurations["environment"]>(
      process.env["ENVIRONMENT"],
      "local"
    ),
    logLevel: valueOrFallback<Configurations["logLevel"]>(
      process.env["LOG_LEVEL"],
      "info"
    ),
    port: valueOrFallback<Configurations["port"]>(process.env["PORT"], 3000),
    bindAddress: valueOrFallback<Configurations["bindAddress"]>(
      process.env["BIND_ADDRESS"],
      "0.0.0.0"
    ),
    jwtPublicKey: valueOrFallback<Configurations["jwtPublicKey"]>(
      process.env["JWT_PUBLIC_KEY"],
      "super secret key"
    ),
    publicKeyURI: valueOrFallback<Configurations["publicKeyURI"]>(
      process.env["PUBLIC_KEY_URI"],
      ""
    ),
    protocol: valueOrFallback<Configurations["protocol"]>(
      process.env["PROTOCOL"],
      ""
    ),
    infrastructureEndpoint: valueOrFallback<
      Configurations["infrastructureEndpoint"]
    >(process.env["INFRASTRUCTURE_ENDPOINT"], ""),
    mapsTableName: valueOrFallback<Configurations["mapsTableName"]>(
      process.env["MAPS_TABLE_NAME"],
      "maps"
    ),
    markersTableName: valueOrFallback<Configurations["markersTableName"]>(
      process.env["MARKERS_TABLE_NAME"],
      "markers"
    ),
    imagesTableName: valueOrFallback<Configurations["imagesTableName"]>(
      process.env["IMAGES_TABLE_NAME"],
      "images"
    ),
  };

  isLocalEnv = () => this.configurations.environment === "local";

  getURL = () => {
    if (this.isLocalEnv())
      return `${this.configurations.protocol}://${this.configurations.domain}:${this.configurations.port}`;
    return `${this.configurations.protocol}://${this.configurations.subdomain}.${this.configurations.domain}:${this.configurations.port}`;
  };
}

type AppDiConfig = Record<"appConfig", Resolver<AppConfig>>;

export function resolveAppDiConfig(): AppDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
  };
}
