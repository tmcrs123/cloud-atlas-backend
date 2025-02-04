import {
  AttributeValue,
  BatchWriteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesInjectableDependencies } from "../config/index.js";
import {
  CreateImageDTO,
  Image,
  UpdateImageDTO,
} from "../schemas/images-schema.js";
import { ImagesRepository } from "./index.js";

export class DynamoDbImagesRepository implements ImagesRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
        region: this.appConfig.awsConfiguration.region,
        credentials: {
          accessKeyId: this.appConfig.configurations.databaseAccessKeyId,
          secretAccessKey:
            this.appConfig.configurations.databaseSecretAccessKey,
        },
      }),
    });
  }
  async createImage(createImageDto: CreateImageDTO): Promise<Image> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      Item: marshall(createImageDto),
    });

    await sendCommand(() => this.dynamoClient.send(command));
    return {
      ...createImageDto,
    };
  }

  async deleteImages(mapId: string, imageIds: string[]): Promise<void> {
    if (imageIds.length === 0) return;

    const unprocessedImagesIds = [...imageIds];

    function createBatchWriteCommand(imageIds: string[], tableName: string) {
      let deleteImagesRequests: WriteRequest[] = [];
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

      return new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: deleteImagesRequests,
        },
      });
    }

    if (unprocessedImagesIds.length <= 25) {
      await sendCommand(() =>
        this.dynamoClient.send(
          createBatchWriteCommand(
            unprocessedImagesIds,
            this.appConfig.configurations.imagesTableName
          )
        )
      );
      return;
    }

    while (unprocessedImagesIds.length !== 0) {
      const batch = unprocessedImagesIds.splice(0, 25);
      const command = createBatchWriteCommand(
        batch,
        this.appConfig.configurations.imagesTableName
      );
      await sendCommand(() => this.dynamoClient.send(command));
    }
  }

  async getImagesForMarker(mapId: string, markerId: string): Promise<Image[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":mapId": marshall(mapId),
      ":markerId": marshall(markerId),
    };
    const KeyConditionExpression = "mapId = :mapId AND markerId = :markerId ";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
      IndexName: this.appConfig.awsConfiguration.imagesTableLSI,
    });

    const commandResponse: QueryCommandOutput = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items || commandResponse.Items.length === 0) return [];

    return commandResponse.Items.map((item) => unmarshall(item) as Image);
  }

  async getImagesForMap(mapId: string): Promise<Image[]> {
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

    if (!commandResponse.Items || commandResponse.Items.length === 0) return [];

    return commandResponse.Items.map((item) => unmarshall(item) as Image);
  }

  async updateImage(
    updatedData: UpdateImageDTO,
    mapId: string,
    imageId: string
  ): Promise<Image> {
    let updateExpression = [];
    updateExpression.push("legend=:legend");

    let expressionAttributeValues: Record<string, AttributeValue> = {};
    expressionAttributeValues[":legend"] = marshall(updatedData.legend);

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      Key: {
        mapId: { ...marshall(mapId) },
        imageId: { ...marshall(imageId) },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(imageId)",
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );
    return unmarshall(commandResponse.Attributes!) as Image;
  }
}
