import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ImagesRepository } from "./index.js";
import { marshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesInjectableDependencies } from "../config/index.js";

export class DynamoDbImagesRepository implements ImagesRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
      }),
    });
  }

  async deleteImageFromMarker(
    mapId: string,
    markerId: string,
    imageId: string
  ): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.mapsTableName,
      Key: {
        mapId: { ...marshall(mapId) },
        imageId: { ...marshall(imageId) },
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
      TableName: this.appConfig.configurations.imagesTableName,
      Item: marshall({ mapId, imageId, markerId }),
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }
}
