import {
  type AttributeValue,
  BatchWriteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  type QueryCommandOutput,
  UpdateItemCommand,
  type WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";
import type { AppConfig } from "../../../shared/configs/app-config.js";
import type { ImagesInjectableDependencies } from "../config/images-config.js";
import type {
  CreateImageDTO,
  Image,
  UpdateImageDTO,
} from "../schemas/images-schema.js";
import type { ImagesRepository } from "./images-repository.js";

export class DynamoDbImagesRepository implements ImagesRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: ImagesInjectableDependencies) {
    this.appConfig = appConfig;
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
        region: this.appConfig.configurations.region,
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

  async deleteImages(atlasId: string, imageIds: string[]): Promise<void> {
    if (imageIds.length === 0) return;

    const unprocessedImagesIds = [...imageIds];

    function createBatchWriteCommand(imageIds: string[], tableName: string) {
      const deleteImagesRequests: WriteRequest[] = [];
      imageIds.forEach((imageId) => {
        deleteImagesRequests.push({
          DeleteRequest: {
            Key: {
              atlasId: marshall(atlasId),
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

  async getImagesForMarker(
    atlasId: string,
    markerId: string
  ): Promise<Image[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":atlasId": marshall(atlasId),
      ":markerId": marshall(markerId),
    };
    const KeyConditionExpression =
      "atlasId = :atlasId AND markerId = :markerId ";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
      IndexName: this.appConfig.configurations.imagesTableLSIName,
    });

    const commandResponse: QueryCommandOutput = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items || commandResponse.Items.length === 0) return [];

    return commandResponse.Items.map((item) => unmarshall(item) as Image);
  }

  async getImagesForAtlas(atlasId: string): Promise<Image[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":atlasId": marshall(atlasId),
    };
    const KeyConditionExpression = "atlasId = :atlasId";

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
    atlasId: string,
    imageId: string
  ): Promise<Image> {
    const updateExpression = [];
    updateExpression.push("legend=:legend");

    const expressionAttributeValues: Record<string, AttributeValue> = {};
    expressionAttributeValues[":legend"] = marshall(updatedData.legend);

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.imagesTableName,
      Key: {
        atlasId: { ...marshall(atlasId) },
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
