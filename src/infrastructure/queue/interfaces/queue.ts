export interface QueueService {
  send(messageBody: string): void;
  receive(): void;
  delete(receiptHandle: string): void;
  startPolling(): void;
}
