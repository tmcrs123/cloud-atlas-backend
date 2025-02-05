import { randomUUID } from 'node:crypto'
import { S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import type { SecretsService } from '../../../infrastructure/secrets/interfaces/secrets-service.js'
import type { ImagesURLsService } from './images-urls-service.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { ImagesInjectableDependencies } from '../config/images-config.js'

export class AwsImagesURLsService implements ImagesURLsService {
  private readonly s3Client: S3Client
  private readonly appConfig: AppConfig
  private readonly secretsService: SecretsService

  constructor({ appConfig, secretsService }: ImagesInjectableDependencies) {
    this.appConfig = appConfig
    this.secretsService = secretsService

    this.s3Client = new S3Client({
      region: this.appConfig.configurations.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    })
  }

  async getUrlForExistingImage(atlasId: string, markerId: string, imageId: string): Promise<string> {
    if (this.appConfig.isLocalEnv()) return ''

    const privateKey = await this.secretsService.getSecret(this.appConfig.configurations.optimizedPhotosPrivateKeyName)

    if (!privateKey) {
      throw new Error('Secret not found')
    }

    const signedUrl = getSignedUrl({
      keyPairId: this.appConfig.configurations.optimizedPhotosKeypairId,
      privateKey,
      url: `https://${this.appConfig.configurations.optimizedPhotoDistributionUrl}/${atlasId}/${markerId}/${imageId}`,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
    })

    return Promise.resolve(signedUrl)
  }

  async getPreSignedUrl(atlasId: string, markerId: string): Promise<{ url: string; fields: Record<string, string> }> {
    const { url, fields } = await createPresignedPost(this.s3Client, {
      Bucket: this.appConfig.configurations.s3DumpBucketName,
      Key: `${atlasId}/${markerId}/${randomUUID()}`,
      Expires: this.appConfig.configurations.s3PresignedUrlExpirationInSeconds,
    })
    return { url, fields }
  }
}
