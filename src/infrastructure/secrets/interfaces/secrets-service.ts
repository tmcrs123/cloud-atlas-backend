export interface SecretsService {
  getSecret(secretId: string): Promise<string | null>;
}
