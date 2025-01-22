import {
  AttributeValue,
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  UpdateItemCommand,
  WriteRequest,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/index.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { MarkersInjectableDependencies } from "../config/index.js";
import {
  CreateMarkerDTO,
  Marker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";
import { MarkersRepository } from "./index.js";

export class DynamoDbMarkersRepository implements MarkersRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: MarkersInjectableDependencies) {
    this.appConfig = appConfig;
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
      }),
    });
  }

  async createMarker(createMarkerDTO: CreateMarkerDTO): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Item: marshall(createMarkerDTO),
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }

  async createManyMarkers(createMarkerDTOs: CreateMarkerDTO[]): Promise<void> {
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

    return;
  }

  async getMarker(markerId: string): Promise<Partial<Marker> | null> {
    const command = new GetItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
      },
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Item) return null;
    return unmarshall(commandResponse.Item);
  }

  async getMarkersForMap(mapId: string): Promise<Marker[] | null> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":mapId": marshall(mapId),
    };
    const KeyConditionExpression = "mapId = :mapId";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.markersTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items) return null;
    if (commandResponse.Count === 0) return null;

    return commandResponse.Items.map((item) => unmarshall(item) as Marker);
  }

  async deleteMarker(markerId: string, mapId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        mapId: { ...marshall(mapId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async deleteManyMarkers(markerIds: string[], mapId: string): Promise<void> {
    const deleteMarkersRequests: WriteRequest[] = [];

    markerIds.forEach((markerId) => {
      deleteMarkersRequests.push({
        DeleteRequest: {
          Key: {
            mapId: marshall(mapId),
            markerId: marshall(markerId),
          },
        },
      });
    });

    const command = new BatchWriteItemCommand({
      RequestItems: {
        [this.appConfig.configurations.markersTableName]: deleteMarkersRequests,
      },
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }

  async updateMarker(
    markerId: string,
    mapId: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<Marker> | null> {
    let updateExpression: string[] = [];
    let expressionAttributeValues: Record<string, AttributeValue> = {};

    Object.entries(updatedData).forEach(([key, value]) => {
      if (value) {
        updateExpression.push(`${key}=:${key}`);
        expressionAttributeValues[`:${key}`] = marshall(value);
      }
    });

    //marshall works in a weird way for objects of type M (as in Map), in that you need to give it the full object otherwise it won't marshall correctly
    //for example, for the coordinates you need to pass the object as {coordinates: {lat, lng}} and not just {lat,lng}
    //therefore the following line deals with this problem explicitly for coordinates

    expressionAttributeValues[":coordinates"] = {
      M: marshall(updatedData.coordinates),
    };

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        mapId: { ...marshall(mapId) },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression:
        "attribute_exists(markerId) AND attribute_exists(mapId)",
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Attributes) return null;

    return unmarshall(commandResponse.Attributes);
  }

  async updateImageCount(markerId: string, mapId: string): Promise<void> {
    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.markersTableName,
      Key: {
        markerId: { ...marshall(markerId) },
        mapId: { ...marshall(mapId) },
      },
      UpdateExpression: "ADD imageCount :imageCount",
      ExpressionAttributeValues: { ":imageCount": marshall(1) },
    });

    await sendCommand(() => this.dynamoClient.send(command));
  }
}
