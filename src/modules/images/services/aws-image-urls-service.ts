import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { ImagesURLsService } from "./index.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesInjectableDependencies } from "../config/index.js";

export class AwsImagesURLsService implements ImagesURLsService {
  private readonly s3Client: S3Client;
  private appConfig: AppConfig;

  constructor({ appConfig }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
    this.s3Client = new S3Client({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });
  }
  getUrlForExistingImage(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<string> {
    // placeholder
    return Promise.resolve("bananas");
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
