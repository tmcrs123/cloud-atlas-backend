import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { ImagesURLsService } from "./index.js";

export class AwsImagesURLsService implements ImagesURLsService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: "us-east-1",
      endpoint: "http://localhost:4566",
    });
  }

  async getPreSignedUrl(mapId: string, markerId: string): Promise<any> {
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: "snappin-dump",
      Key: `${mapId}/${markerId}/${randomUUID()}`,
      Expires: 600, //Seconds before the presigned post expires. 3600 by default.
    });
    return { url, fields };
  }
}
