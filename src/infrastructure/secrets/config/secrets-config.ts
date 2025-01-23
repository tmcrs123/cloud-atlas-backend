import { asClass, Resolver } from "awilix";
import { AwsSecretsService } from "../implementations/aws-secrets-service.js";
import { SecretsService } from "../interfaces/secrets-service.js";
import { AppConfig } from "../../../shared/configs/index.js";

export type SecretsInfrastructureModuleDependencies = {
  appConfig: AppConfig;
  secretsService: SecretsService;
};

type SecretsDiConfig = Record<
  keyof SecretsInfrastructureModuleDependencies,
  Resolver<any>
>;
export type SecretsInjectableDependencies =
  SecretsInfrastructureModuleDependencies;

export function resolveSecretsDiConfig(): SecretsDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
    secretsService: asClass(AwsSecretsService, {
      lifetime: "SINGLETON",
    }),
  };
}
