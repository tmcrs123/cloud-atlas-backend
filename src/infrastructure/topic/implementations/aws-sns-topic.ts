import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { TopicInjectableDependencies } from '../config/topic-config.js'
import type { TopicService } from '../interfaces/topic.js'

// match the format of a vanilla SNS event
type snsS3Message = {
  Records: {
    awsRegion: string
    eventName: string
    s3: {
      bucket: { name: string }
      object: { key: string }
    }
  }[]
}

export class AwsSnsTopicService implements TopicService {
  private readonly snsClient: SNSClient
  private appConfig: AppConfig

  constructor({ appConfig }: TopicInjectableDependencies) {
    this.appConfig = appConfig
    this.snsClient = new SNSClient({
      region: this.appConfig.configurations.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    })
  }

  async pushMessageToTopic(atlasId: string, markerId: string, imageId: string): Promise<void> {
    const msg: snsS3Message = {
      Records: [
        {
          awsRegion: this.appConfig.configurations.region,
          eventName: 'ObjectRemoved:Delete',
          s3: {
            bucket: {
              name: this.appConfig.configurations.s3OptimizedBucketName,
            },
            object: {
              key: `${atlasId}/${markerId}/${imageId}`,
            },
          },
        },
      ],
    }
    const command = new PublishCommand({
      TopicArn: this.appConfig.configurations.topicARN,
      Message: JSON.stringify(msg),
    })

    await this.snsClient.send(command)

    return
  }
}
