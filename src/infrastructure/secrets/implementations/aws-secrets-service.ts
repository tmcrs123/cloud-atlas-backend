import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { SecretsService } from "../interfaces/index.js";
import { SecretsInjectableDependencies } from "../config/secrets-config.js";
import { AppConfig } from "../../../shared/configs/index.js";

export class AwsSecretsService implements SecretsService {
  private readonly secretsManagerClient: SecretsManagerClient;
  private readonly appConfig: AppConfig;

  constructor({ appConfig }: SecretsInjectableDependencies) {
    this.appConfig = appConfig;
    this.secretsManagerClient = new SecretsManagerClient({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });
  }

  async getSecret(secretId: string): Promise<string | null> {
    const command = new GetSecretValueCommand({
      SecretId: secretId,
    });
    console.info(JSON.stringify(command));
    const commandResponse = await this.secretsManagerClient.send(command);

    if (!commandResponse.SecretString) return null;

    return commandResponse.SecretString;
  }
}
