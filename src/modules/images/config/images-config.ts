import { type Resolver, asClass, asFunction } from 'awilix'
import { AwsSecretsService } from '../../../infrastructure/secrets/implementations/aws-secrets-service.js'
import type { SecretsService } from '../../../infrastructure/secrets/interfaces/secrets-service.js'
import { AppConfig } from '../../../shared/configs/app-config.js'
import { DynamoDbMarkersRepository } from '../../markers/repositories/dynamodb-markers-repository.js'
import type { MarkersRepository } from '../../markers/repositories/markers-repository.js'
import { DynamoDbImagesRepository } from '../repositories/dynamodb-images-repository.js'
import type { ImagesRepository } from '../repositories/images-repository.js'
import { AwsImagesURLsService } from '../services/aws-image-urls-service.js'
import { ImagesService } from '../services/images-service.js'
import type { ImagesURLsService } from '../services/images-urls-service.js'
import { MockImageUrlsService } from '../services/mock-image-urls-service.js'

export type ImagesModuleDependencies = {
  appConfig: AppConfig
  imagesService: ImagesService
  imagesRepository: ImagesRepository
  markersRepository: MarkersRepository
  imagesURLsService: ImagesURLsService
  secretsService: SecretsService
}

type ImagesDiConfig = Record<keyof ImagesModuleDependencies, Resolver<any>>
export type ImagesInjectableDependencies = ImagesModuleDependencies

export function resolveImagesDiConfig(isLocalEnv: boolean): ImagesDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: 'SINGLETON',
    }),
    imagesService: asClass(ImagesService, {
      lifetime: 'SINGLETON',
    }),
    imagesRepository: asClass(DynamoDbImagesRepository, {
      lifetime: 'SINGLETON',
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: 'SINGLETON',
    }),
    imagesURLsService: asFunction((deps) => (isLocalEnv ? new MockImageUrlsService(deps) : new AwsImagesURLsService(deps)), { lifetime: 'SINGLETON' }),
    secretsService: asClass(AwsSecretsService, { lifetime: 'SINGLETON' }),
  }
}
