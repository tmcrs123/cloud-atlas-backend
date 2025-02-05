import { asClass, type Resolver } from 'awilix'
import { ImagesService } from '../../../modules/images/services/images-service.js'
import { AppConfig } from '../../../shared/configs/app-config.js'
import { AwsSQSProcessImageQueue } from '../implementations/aws-sqs-process-image-queue.js'
import type { QueueService } from '../interfaces/queue.js'

export type QueueInfrastructureDependencies = {
  appConfig: AppConfig
  imagesService: ImagesService
  queue: QueueService
}

type QueueDiConfig = Record<keyof QueueInfrastructureDependencies, Resolver<any>>
export type QueueInjectableDependencies = QueueInfrastructureDependencies

export function resolveQueueDiConfig(): QueueDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: 'SINGLETON',
    }),
    imagesService: asClass(ImagesService, { lifetime: 'SINGLETON' }),
    queue: asClass(AwsSQSProcessImageQueue, { lifetime: 'SINGLETON' }),
  }
}
