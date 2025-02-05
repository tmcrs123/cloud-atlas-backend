import { type Resolver, asClass, asFunction } from 'awilix'
import { AwsSnsTopicService } from '../../infrastructure/topic/implementations/aws-sns-topic.js'
import type { TopicService } from '../../infrastructure/topic/interfaces/topic.js'
import { AppConfig } from '../../shared/configs/app-config.js'
import { AtlasService } from '../atlas/services/atlas-service.js'
import { AwsImagesURLsService } from '../images/services/aws-image-urls-service.js'
import { ImagesService } from '../images/services/images-service.js'
import type { ImagesURLsService } from '../images/services/images-urls-service.js'
import { MockImageUrlsService } from '../images/services/mock-image-urls-service.js'
import { MarkersService } from '../markers/services/markers-service.js'
import { DomainService } from './services/domain-service.js'

export type DomainModuleDependencies = {
  appConfig: AppConfig
  domainService: DomainService
  atlasService: AtlasService
  imagesService: ImagesService
  markersService: MarkersService
  topicService: TopicService
  imagesURLsService: ImagesURLsService
}

type DomainDiConfig = Record<keyof DomainModuleDependencies, Resolver<any>>
export type DomainInjectableDependencies = DomainModuleDependencies

export function resolveDomainDiConfig(isLocalEnv: boolean): DomainDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: 'SINGLETON' }),
    domainService: asClass(DomainService, { lifetime: 'SINGLETON' }),
    atlasService: asClass(AtlasService, {
      lifetime: 'SINGLETON',
    }),
    markersService: asClass(MarkersService, {
      lifetime: 'SINGLETON',
    }),
    imagesService: asClass(ImagesService, {
      lifetime: 'SINGLETON',
    }),
    topicService: asClass(AwsSnsTopicService, {
      lifetime: 'SINGLETON',
    }),
    imagesURLsService: asFunction((deps) => (isLocalEnv ? new MockImageUrlsService(deps) : new AwsImagesURLsService(deps)), { lifetime: 'SINGLETON' }),
  }
}
