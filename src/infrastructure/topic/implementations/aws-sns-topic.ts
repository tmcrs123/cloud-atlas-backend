import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { TopicInjectableDependencies } from "../config/index.js";
import { Topic } from "../interfaces/index.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export class AwsSnsTopic implements Topic {
  private readonly snsClient: SNSClient;
  private readonly topicURL: string;

  constructor({ appConfig }: TopicInjectableDependencies) {
    this.snsClient = new SNSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      endpoint: "http://localhost:4566",
    });

    this.topicURL = appConfig.configurations.baseUrl;
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
