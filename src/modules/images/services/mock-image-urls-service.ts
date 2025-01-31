import { randomUUID } from "node:crypto";
import { ImagesURLsService } from "./images-urls-service.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import { AppConfig } from "../../../shared/configs/app-config.js";

export class MockImageUrlsService implements ImagesURLsService {
  private readonly appConfig: AppConfig;

  constructor({ appConfig, secretsService }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
  }
  getPreSignedUrl(
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
  getUrlForExistingImage(
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
