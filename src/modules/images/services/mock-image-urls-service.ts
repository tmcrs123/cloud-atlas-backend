import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { SecretsService } from "../../../infrastructure/secrets/interfaces/secrets-service.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { ImagesURLsService } from "./index.js";

export class MockImageUrlsService implements ImagesURLsService {
  private readonly s3Client: S3Client;
  private readonly appConfig: AppConfig;
  private readonly secretsService: SecretsService;

  constructor({ appConfig, secretsService }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
    this.secretsService = secretsService;

    this.s3Client = new S3Client({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });
  }

  async getPreSignedUrl(
    mapId: string,
    markerId: string
  ): Promise<{ url: string; fields: Record<string, string> }> {
    const key = randomUUID();

    return new Promise((resolve) => {
      resolve({
        url: `${this.appConfig.configurations.protocol}://${this.appConfig.configurations.domain}:${this.appConfig.configurations.port}/upload/${mapId}/${markerId}/${key}`,
        fields: {
          key: `${mapId}/${markerId}/${key}`,
          AWSAccessKeyId: "mock-access-key-id",
          policy: "mock-policy",
          signature: "mock-signature",
        },
      });
    });
  }
  async getUrlForExistingImage(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<string> {
    const getRandomNumber = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const width = getRandomNumber(600, 1200);
    const height = getRandomNumber(600, 1200);

    return new Promise((resolve, reject) => {
      resolve(
        `https://picsum.photos/seed/${Math.random()
          .toString(36)
          .substring(2, 5)}/${width}/${height}`
      );
    });
  }
}
