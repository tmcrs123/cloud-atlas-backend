import {
  Message as AwsMessage,
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { QueueService } from "../interfaces/index.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesService } from "../../../modules/images/services/index.js";
import { QueueInjectableDependencies } from "../config/index.js";
import { Message } from "../../../shared/types/index.js";

export class AwsSQSProcessImageQueue implements QueueService {
  private appConfig: AppConfig;
  private queueUrl: string;

  private sqsClient: SQSClient;
  private imagesService: ImagesService;

  constructor({ appConfig, imagesService }: QueueInjectableDependencies) {
    this.appConfig = appConfig;
    this.imagesService = imagesService;

    this.sqsClient = new SQSClient({
      region: this.appConfig.awsConfiguration.region,
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.infrastructureEndpoint,
      }),
    });

    this.queueUrl = this.appConfig.awsConfiguration.queueURL;
  }

  async send(messageBody: string): Promise<void> {
    const input: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    };

    await this.sqsClient.send(new SendMessageCommand(input));
  }
  async receive(): Promise<void> {
    const input: ReceiveMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: this.appConfig.awsConfiguration.queueMaxMessages,
      WaitTimeSeconds: this.appConfig.awsConfiguration.queueWaitTimeSeconds,
    };

    const output = await this.sqsClient.send(new ReceiveMessageCommand(input));
    const messages = output.Messages?.map((awsMessage: AwsMessage): Message => {
      return {
        id: awsMessage.MessageId!,
        body: awsMessage.Body!,
        receiptHandle: awsMessage.ReceiptHandle!,
      };
    });

    if (!messages) return;
    await this.imagesService.processImageUploadedMessages(messages);

    await Promise.all(
      messages.map(
        (message) => message.receiptHandle && this.delete(message.receiptHandle)
      )
    );
  }

  async delete(receiptHandle: string): Promise<void> {
    const input: DeleteMessageCommandInput = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle, // ReceiptHandle is used to delete the message
    };

    await this.sqsClient.send(new DeleteMessageCommand(input));
  }

  startPolling(): void {
    setInterval(() => {
      this.receive();
    }, this.appConfig.awsConfiguration.queuePollingInterval);
  }
}
