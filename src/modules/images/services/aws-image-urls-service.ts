import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { ImagesURLsService } from "./index.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { SecretsService } from "../../../infrastructure/secrets/interfaces/secrets-service.js";

export class AwsImagesURLsService implements ImagesURLsService {
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

  async getUrlForExistingImage(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<string> {
    if (this.appConfig.isLocalEnv()) return "";

    const privateKey = await this.secretsService.getSecret(
      this.appConfig.configurations.optimizedPhotosPrivateKeyName
    );

    if (!privateKey) {
      throw new Error("Secret not found");
    }

    const signedUrl = getSignedUrl({
      keyPairId: this.appConfig.configurations.optimizedPhotosKeypairId,
      privateKey,
      url: `https://${this.appConfig.configurations.optimizedPhotoDistributionUrl}/${mapId}/${markerId}/${imageId}`,
      dateLessThan: new Date(Date.now() + 1000 * 60).toISOString(),
    });

    return Promise.resolve(signedUrl);
  }

  async getPreSignedUrl(
    mapId: string,
    markerId: string
  ): Promise<{ url: string; fields: Record<string, string> }> {
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.appConfig.awsConfiguration.s3DumpBucketName,
      Key: `${mapId}/${markerId}/${randomUUID()}`,
      Expires:
        this.appConfig.awsConfiguration.s3PresignedUrlExpirationInSeconds,
    });
    return { url, fields };
  }
}
