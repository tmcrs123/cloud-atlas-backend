import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ImagesRepository } from "./index.js";
import { marshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";

export class DynamoDbImagesRepository implements ImagesRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async deleteImageFromMarker(
    markerId: string,
    imageId: string
  ): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: "maps",
      Key: {
        imageId: { ...marshall(imageId) },
        markerId: { ...marshall(markerId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async getImagesForMarker(id: string): Promise<void> {
    return;
  }

  async saveImagesDetails(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void> {
    const command = new PutItemCommand({
      TableName: "images",
      Item: marshall({ mapId, imageId, markerId }),
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }
}
