import { type Resolver, asClass } from 'awilix'
import { AppConfig } from '../../../shared/configs/app-config.js'
import type { AtlasRepository } from '../repositories/atlas-repository.js'
import { DynamoDbAtlasRepository } from '../repositories/dynamodb-atlas-repository.js'
import type { UserAtlasRepository } from '../repositories/user-atlas-repository.js'
import { AtlasService } from '../services/atlas-service.js'
import { DynamoDbUserAtlasRepository } from '../repositories/dynamodb-user-atlas-repository.js'

export type AtlasModuleDependencies = {
  appConfig: AppConfig
  atlasRepository: AtlasRepository
  userAtlasRepository: UserAtlasRepository
  atlasService: AtlasService
}

type AtlasDiConfig = Record<keyof AtlasModuleDependencies, Resolver<any>>
export type AtlasInjectableDependencies = AtlasModuleDependencies

export function resolveAtlasDiConfig(): AtlasDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: 'SINGLETON' }),
    atlasRepository: asClass(DynamoDbAtlasRepository, {
      lifetime: 'SINGLETON',
    }),
    userAtlasRepository: asClass(DynamoDbUserAtlasRepository, {
      lifetime: 'SINGLETON',
    }),
    atlasService: asClass(AtlasService, { lifetime: 'SINGLETON' }),
  }
}
