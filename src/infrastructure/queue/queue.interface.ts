export interface IQueue {
  send(messageBody: string): void;
  receive(): void;
  delete(receiptHandle: string): void;
  startPolling(): void;
}
