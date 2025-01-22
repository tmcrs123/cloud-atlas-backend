import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { AppConfig } from "../../../shared/configs/index.js";
import { TopicInjectableDependencies } from "../config/index.js";
import { Topic } from "../interfaces/index.js";

// match the format of a vanilla SNS event
type snsS3Message = {
  Records: {
    awsRegion: string;
    eventName: string;
    s3: {
      bucket: { name: string };
      object: { key: string };
    };
  }[];
};

export class AwsSnsTopic implements Topic {
  private readonly snsClient: SNSClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: TopicInjectableDependencies) {
    this.appConfig = appConfig;
    this.snsClient = new SNSClient({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });
  }

  async pushMessageToTopic(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void> {
    const msg: snsS3Message = {
      Records: [
        {
          awsRegion: this.appConfig.awsConfiguration.region,
          eventName: "ObjectRemoved:Delete",
          s3: {
            bucket: {
              name: this.appConfig.awsConfiguration.s3OptimizedBucketName,
            },
            object: {
              key: `${mapId}/${markerId}/${imageId}`,
            },
          },
        },
      ],
    };
    const command = new PublishCommand({
      TopicArn: this.appConfig.awsConfiguration.topicARN,
      Message: JSON.stringify(msg),
    });

    await this.snsClient.send(command);

    return;
  }
}
