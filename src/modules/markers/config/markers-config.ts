import { type Resolver, asClass } from 'awilix'
import { AppConfig } from '../../../shared/configs/app-config.js'
import { DynamoDbMarkersRepository } from '../repositories/dynamodb-markers-repository.js'
import type { MarkersRepository } from '../repositories/markers-repository.js'
import { MarkersService } from '../services/markers-service.js'

export type MarkersModuleDependencies = {
  appConfig: AppConfig
  markersRepository: MarkersRepository
  markersService: MarkersService
}

type MarkersDiConfig = Record<keyof MarkersModuleDependencies, Resolver<any>>
export type MarkersInjectableDependencies = MarkersModuleDependencies

export function resolveMarkersDiConfig(): MarkersDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: 'SINGLETON',
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: 'SINGLETON',
    }),
    markersService: asClass(MarkersService, { lifetime: 'SINGLETON' }),
  }
}
