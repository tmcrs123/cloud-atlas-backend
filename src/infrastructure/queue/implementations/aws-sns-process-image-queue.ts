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
import { Queue } from "../interfaces/index.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesService } from "../../../modules/images/services/index.js";
import { QueueInjectableDependencies } from "../config/index.js";
import { Message } from "../../../shared/types/index.js";

export class AwsSNSProcessImageQueue implements Queue {
  private appConfig: AppConfig;
  private queueUrl: string;

  private sqsClient: SQSClient;
  private imagesService: ImagesService;

  constructor({ appConfig, imagesService }: QueueInjectableDependencies) {
    this.appConfig = appConfig;
    this.imagesService = imagesService;

    this.sqsClient = new SQSClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
      },
      endpoint: "http://localhost:4566",
    });

    this.queueUrl =
      "http://sqs.us-east-1.localstack:4566/000000000000/snappin-queue";
  }

  async send(messageBody: string): Promise<void> {
    const input: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    };

    await this.sqsClient.send(new SendMessageCommand(input));
  }
  async receive(): Promise<Message[] | undefined> {
    const input: ReceiveMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    };

    const output = await this.sqsClient.send(new ReceiveMessageCommand(input));
    const messages = output.Messages?.map((awsMessage: AwsMessage): Message => {
      return {
        id: awsMessage.MessageId!,
        body: awsMessage.Body!,
        receiptHandle: awsMessage.ReceiptHandle!,
      };
    });

    if (!messages) return undefined;
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
    }, 10000);
  }
}
