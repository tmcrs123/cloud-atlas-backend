import { DeleteMessageCommand, type DeleteMessageCommandInput, type Message as AwsMessage, ReceiveMessageCommand, type ReceiveMessageCommandInput, SQSClient, SendMessageCommand, type SendMessageCommandInput } from '@aws-sdk/client-sqs'
import type { ImagesService } from '../../../modules/images/services/images-service.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { QueueInjectableDependencies } from '../config/queue-config.js'
import type { QueueService } from '../interfaces/queue.js'
import type { AppMessage } from '../../../shared/types/common-types.js'

export class AwsSQSProcessImageQueue implements QueueService {
  private appConfig: AppConfig
  private queueUrl: string

  private sqsClient: SQSClient
  private imagesService: ImagesService

  constructor({ appConfig, imagesService }: QueueInjectableDependencies) {
    this.appConfig = appConfig
    this.imagesService = imagesService

    this.sqsClient = new SQSClient({
      region: this.appConfig.configurations.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    })

    this.queueUrl = this.appConfig.configurations.queueURL
  }

  async send(messageBody: string): Promise<void> {
    const input: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    }

    await this.sqsClient.send(new SendMessageCommand(input))
  }
  async receive(): Promise<void> {
    const input: ReceiveMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: this.appConfig.configurations.queueMaxMessages,
      WaitTimeSeconds: this.appConfig.configurations.queueWaitTimeSeconds,
    }

    const output = await this.sqsClient.send(new ReceiveMessageCommand(input))
    const messages = output.Messages?.map((awsMessage: AwsMessage): AppMessage => {
      return {
        id: awsMessage.MessageId!,
        body: awsMessage.Body!,
        receiptHandle: awsMessage.ReceiptHandle!,
      }
    })

    if (!messages) return
    await this.imagesService.processImageUploadedMessages(messages)

    await Promise.all(messages.map((message) => message.receiptHandle && this.delete(message.receiptHandle)))
  }

  async delete(receiptHandle: string): Promise<void> {
    const input: DeleteMessageCommandInput = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle, // ReceiptHandle is used to delete the message
    }

    await this.sqsClient.send(new DeleteMessageCommand(input))
  }

  startPolling(): void {
    setInterval(() => {
      this.receive()
    }, this.appConfig.configurations.queuePollingInterval)
  }
}
