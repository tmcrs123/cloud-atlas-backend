import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ImagesRepository } from "./index.js";

export class DynamoDbImagesRepository implements ImagesRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async getImagesForMarker(id: string): Promise<void> {
    return;
  }
}
