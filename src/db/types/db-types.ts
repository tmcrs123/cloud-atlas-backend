export type DynamoDbError = {
  message: string;
  name: string;
  $metadata: {
    httpStatusCode: number;
    requestId: string;
  };
};
