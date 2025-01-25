import { ImagesURLsService } from "./images-urls-service.js";

export class MockImageUrlsService implements ImagesURLsService {
  getPreSignedUrl(
    mapId: string,
    markerId: string
  ): Promise<{ url: string; fields: Record<string, string> }> {
    return new Promise((resolve) => {
      resolve({
        url: `https://example.com/upload/${mapId}/${markerId}`,
        fields: {
          key: `${mapId}/${markerId}`,
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
