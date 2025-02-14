import {
  DynamoDBClient,
  BatchWriteItemCommand,
  GetItemCommand,
  type AttributeValue,
  QueryCommand,
  DeleteItemCommand,
  type WriteRequest,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";
import type { AppConfig } from "../../../shared/configs/app-config.js";
import type { MarkersInjectableDependencies } from "../config/markers-config.js";
import type {
  CreateMarkerDTO,
  Marker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";
import type { MarkersRepository } from "./markers-repository.js";

export class DynamoDbMarkersRepository implements MarkersRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: MarkersInjectableDependencies) {
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

  async createMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<Marker[]> {
    const newMarkers = createMarkerDTOs.map((dto: CreateMarkerDTO) => {
      return {
        PutRequest: {
          Item: marshall({ ...dto }),
        },
      };
    });
    const createMarkersBatchWriteCommandInput = {
      RequestItems: {
        [this.appConfig.configurations.markersTableName]: newMarkers,
      },
    };

    const command = new BatchWriteItemCommand(
      createMarkersBatchWriteCommandInput
    );

    await sendCommand(() => this.dynamoClient.send(command));

    return createMarkerDTOs.map((dto) => ({ ...dto } as Marker));
  }

  async getMarker(atlasId: string, markerId: string): Promise<Marker> {
    const command = new GetItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        atlasId: { ...marshall(atlasId) },
        markerId: { ...marshall(markerId) },
      },
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    return unmarshall(commandResponse.Item!) as Marker;
  }

  async getMarkers(atlasId: string): Promise<Marker[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":atlasId": marshall(atlasId),
    };
    const KeyConditionExpression = "atlasId = :atlasId";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.markersTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items || commandResponse.Items.length === 0) return [];

    return commandResponse.Items!.map((item) => unmarshall(item) as Marker);
  }

  async deleteMarker(markerId: string, atlasId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        atlasId: { ...marshall(atlasId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async deleteMarkers(markerIds: string[], atlasId: string): Promise<void> {
    if (markerIds.length === 0) return;

    const unprocessedMarkerIds = [...markerIds];

    function createBatchWriteCommand(markerIds: string[], tableName: string) {
      const deleteMarkersRequests: WriteRequest[] = [];
      markerIds.forEach((markerId) => {
        deleteMarkersRequests.push({
          DeleteRequest: {
            Key: {
              atlasId: marshall(atlasId),
              markerId: marshall(markerId),
            },
          },
        });
      });

      return new BatchWriteItemCommand({
        RequestItems: {
          [tableName]: deleteMarkersRequests,
        },
      });
    }

    if (unprocessedMarkerIds.length <= 25) {
      await sendCommand(() =>
        this.dynamoClient.send(
          createBatchWriteCommand(
            unprocessedMarkerIds,
            this.appConfig.configurations.markersTableName
          )
        )
      );
      return;
    }

    while (unprocessedMarkerIds.length !== 0) {
      const batch = unprocessedMarkerIds.splice(0, 25);
      const command = createBatchWriteCommand(
        batch,
        this.appConfig.configurations.markersTableName
      );
      await sendCommand(() => this.dynamoClient.send(command));
    }
  }

  async updateMarker(
    markerId: string,
    atlasId: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Marker> {
    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, AttributeValue> = {};

    for (const [key, value] of Object.entries(updatedData)) {
      if (value !== null || value !== undefined) {
        updateExpression.push(`${key}=:${key}`);
        expressionAttributeValues[`:${key}`] = marshall(value);
      }
    }

    //marshall works in a weird way for objects of type M (as in Map), in that you need to give it the full object otherwise it won't marshall correctly
    //for example, for the coordinates you need to pass the object as {coordinates: {lat, lng}} and not just {lat,lng}
    //therefore the following line deals with this problem explicitly for coordinates

    if (updatedData.coordinates) {
      expressionAttributeValues[":coordinates"] = {
        M: marshall(updatedData.coordinates),
      };
    }

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        atlasId: { ...marshall(atlasId) },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression:
        "attribute_exists(markerId) AND attribute_exists(atlasId)",
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    return unmarshall(commandResponse.Attributes!) as Marker;
  }

  async updateImageCount(atlasId: string, markerId: string): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        atlasId: { ...marshall(atlasId) },
      },
      UpdateExpression: "ADD imageCount :imageCount",
      ExpressionAttributeValues: { ":imageCount": marshall(1) },
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }
}
