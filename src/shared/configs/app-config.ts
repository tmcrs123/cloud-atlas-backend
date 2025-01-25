import { asClass, Resolver } from "awilix";
import { LogLevel } from "fastify";
import { parseBoolean, valueOrFallback } from "../../utils/index.js";

export type Configurations = {
  appVersion: string;
  awsConfig: AWSConfiguration;
  bindAddress: string;
  databaseEndpoint: string;
  domain: string;
  environment: "production" | "local" | "test";
  imagesTableName: string;
  infrastructureEndpoint: string;
  jwtPublicKey: string;
  logLevel: LogLevel;
  mapsTableName: string;
  ownersTableName: string;
  markersTableName: string;
  optimizedPhotoDistributionUrl: string;
  optimizedPhotosKeypairId: string;
  optimizedPhotosPrivateKeyName: string;
  port: number;
  protocol: string;
  publicKeyURI: string;
  queueEnabled: boolean;
  subdomain: string;
  topicEnabled: boolean;
  userId: string;
};

export type AWSConfiguration = {
  imagesTableLSI: string;
  queueMaxMessages: number;
  queuePollingInterval: number;
  queueURL: string;
  queueWaitTimeSeconds: number;
  region: string;
  s3DumpBucketName: string;
  s3OptimizedBucketName: string;
  s3PresignedUrlExpirationInSeconds: number;
  topicARN: string;
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
    topicARN: valueOrFallback<AWSConfiguration["topicARN"]>(
      process.env["TOPIC_ARN"],
      "arn:aws:sns:us-east-1:891376964515:snappin-test-bucket-events-topic"
    ),
    s3PresignedUrlExpirationInSeconds: valueOrFallback<
      AWSConfiguration["s3PresignedUrlExpirationInSeconds"]
    >(process.env["S3_PRESIGNED_URL_EXPIRATION_IN_SECONDS"], 300),
    imagesTableLSI: valueOrFallback<AWSConfiguration["imagesTableLSI"]>(
      process.env["IMAGES_TABLE_NAME_LSI"],
      "snappin-local-images-table-LSI"
    ),
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
    ownersTableName: valueOrFallback<Configurations["ownersTableName"]>(
      process.env["OWNERS_TABLE_NAME"],
      "owners"
    ),
    markersTableName: valueOrFallback<Configurations["markersTableName"]>(
      process.env["MARKERS_TABLE_NAME"],
      "markers"
    ),
    imagesTableName: valueOrFallback<Configurations["imagesTableName"]>(
      process.env["IMAGES_TABLE_NAME"],
      "images"
    ),
    queueEnabled: valueOrFallback<Configurations["queueEnabled"]>(
      process.env["QUEUE_ENABLED"] &&
        parseBoolean(process.env["QUEUE_ENABLED"]),
      false
    ),
    topicEnabled: valueOrFallback<Configurations["topicEnabled"]>(
      process.env["TOPIC_ENABLED"] &&
        parseBoolean(process.env["TOPIC_ENABLED"]),
      false
    ),
    optimizedPhotoDistributionUrl: valueOrFallback<
      Configurations["optimizedPhotoDistributionUrl"]
    >(
      process.env["OPTIMIZED_PHOTOS_DISTRIBUTION_URL"],
      "http://localhost:4200"
    ),
    optimizedPhotosPrivateKeyName: valueOrFallback<
      Configurations["optimizedPhotosPrivateKeyName"]
    >(process.env["OPTIMIZED_PHOTOS_PRIVATE_KEY_NAME"], "default-private-key"),
    optimizedPhotosKeypairId: valueOrFallback<
      Configurations["optimizedPhotosKeypairId"]
    >(process.env["OPTIMIZED_PHOTOS_KEYPAIR_ID"], "default-keypair-id"),
    userId: valueOrFallback<Configurations["userId"]>(
      process.env["USER_ID"],
      "6666-6666-6666-6666"
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
