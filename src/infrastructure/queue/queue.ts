export interface Queue {
  send(messageBody: string): void;
  receive(): void;
  delete(receiptHandle: string): void;
  startPolling(): void;
}
