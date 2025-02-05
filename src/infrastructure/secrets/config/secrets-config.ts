import { asClass, type Resolver } from 'awilix'
import { AppConfig } from '../../../shared/configs/app-config.js'
import { AwsSecretsService } from '../implementations/aws-secrets-service.js'
import type { SecretsService } from '../interfaces/secrets-service.js'

export type SecretsInfrastructureModuleDependencies = {
  appConfig: AppConfig
  secretsService: SecretsService
}

type SecretsDiConfig = Record<keyof SecretsInfrastructureModuleDependencies, Resolver<any>>
export type SecretsInjectableDependencies = SecretsInfrastructureModuleDependencies

export function resolveSecretsDiConfig(): SecretsDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: 'SINGLETON' }),
    secretsService: asClass(AwsSecretsService, {
      lifetime: 'SINGLETON',
    }),
  }
}
