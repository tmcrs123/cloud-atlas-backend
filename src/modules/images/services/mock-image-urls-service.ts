import { randomUUID } from 'node:crypto'
import { S3Client } from '@aws-sdk/client-s3'
import type { SecretsService } from '../../../infrastructure/secrets/interfaces/secrets-service.js'
import type { ImagesURLsService } from './images-urls-service.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { ImagesInjectableDependencies } from '../config/images-config.js'

export class MockImageUrlsService implements ImagesURLsService {
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

  async getPreSignedUrl(atlasId: string, markerId: string): Promise<{ url: string; fields: Record<string, string> }> {
    const key = randomUUID()

    return new Promise((resolve) => {
      resolve({
        url: `${this.appConfig.configurations.protocol}://${this.appConfig.configurations.domain}:${this.appConfig.configurations.port}/upload/${atlasId}/${markerId}/${key}`,
        fields: {
          key: `${atlasId}/${markerId}/${key}`,
          AWSAccessKeyId: 'mock-access-key-id',
          policy: 'mock-policy',
          signature: 'mock-signature',
        },
      })
    })
  }
  async getUrlForExistingImage(_atlasId: string, _markerId: string, _imageId: string): Promise<string> {
    const getRandomNumber = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const width = getRandomNumber(600, 1200)
    const height = getRandomNumber(600, 1200)

    return new Promise((resolve) => {
      resolve(`https://picsum.photos/seed/${Math.random().toString(36).substring(2, 5)}/${width}/${height}`)
    })
  }
}
