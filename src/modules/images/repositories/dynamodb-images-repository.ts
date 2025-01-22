import {
  AttributeValue,
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { ImagesRepository } from "./index.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
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
      TableName: this.appConfig.configurations.imagesTableName,
      Key: {
        mapId: { ...marshall(mapId) },
        imageId: { ...marshall(imageId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async deleteAllImagesForMap(
    imageIds: string[],
    mapId: string
  ): Promise<void> {
    const deleteImagesRequests: WriteRequest[] = [];

    imageIds.forEach((imageId) => {
      deleteImagesRequests.push({
        DeleteRequest: {
          Key: {
            mapId: marshall(mapId),
            imageId: marshall(imageId),
          },
        },
      });
    });

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [this.appConfig.configurations.imagesTableName]: deleteImagesRequests,
      },
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }

  async getImagesForMarker(mapId: string, markerId: string): Promise<any[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":mapId": marshall(mapId),
      ":markerId": marshall(markerId),
    };
    const KeyConditionExpression = "mapId = :mapId AND markerId = :markerId ";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
      IndexName: "snappin-local-images-table-LSI",
    });

    const commandResponse: QueryCommandOutput = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items) return [];
    if (commandResponse.Count === 0) return [];

    return commandResponse.Items.map((item) => unmarshall(item));
  }

  async getImagesForMap(mapId: string): Promise<any[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":mapId": marshall(mapId),
    };
    const KeyConditionExpression = "mapId = :mapId";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
    });

    const commandResponse: QueryCommandOutput = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items) return [];
    if (commandResponse.Count === 0) return [];

    return commandResponse.Items.map((item) => unmarshall(item));
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
