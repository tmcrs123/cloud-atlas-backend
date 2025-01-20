import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { AppConfig } from "../../../shared/configs/index.js";
import { TopicInjectableDependencies } from "../config/index.js";
import { Topic } from "../interfaces/index.js";

export class AwsSnsTopic implements Topic {
  private readonly snsClient: SNSClient;
  private appConfig: AppConfig;
  private readonly topicURL: string;

  constructor({ appConfig }: TopicInjectableDependencies) {
    this.appConfig = appConfig;
    this.snsClient = new SNSClient({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });

    this.topicURL = this.appConfig.awsConfiguration.topicURL;
  }

  async pushMessageToTopic(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void> {
    const command = new PublishCommand({
      Message: JSON.stringify({
        action: "REMOVE_OPTIMIZED",
        mapId,
        markerId,
        imageId,
      }),
    });

    await this.snsClient.send(command);

    return;
  }
}
