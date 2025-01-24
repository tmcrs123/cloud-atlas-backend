import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/index.js";
import { CreateMapDTO, Map, UpdateMapDTO } from "../schemas/index.js";
import { MapsRepository } from "./maps-repository.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { MapsInjectableDependencies } from "../config/maps-config.js";

export class DynamoDbMapsRepository implements MapsRepository {
  private dynamoClient: DynamoDBClient;
  private appConfig: AppConfig;

  constructor({ appConfig }: MapsInjectableDependencies) {
    this.appConfig = appConfig;
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
      }),
    });
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Partial<Map>> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.mapsTableName,
      Item: marshall(createMapDto),
    });

    await sendCommand(() => this.dynamoClient.send(command));
    return {
      ...createMapDto,
    };
  }

  async getMap(id: string): Promise<Partial<Map> | null> {
    const command = new GetItemCommand({
      TableName: this.appConfig.configurations.mapsTableName,
      Key: {
        mapId: { ...marshall(id) },
      },
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Item) return null;

    return unmarshall(commandResponse.Item);
  }

  async deleteMap(mapId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.mapsTableName,
      Key: {
        mapId: { ...marshall(mapId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async updateMap(
    updatedData: UpdateMapDTO,
    id: string
  ): Promise<Partial<Map> | null> {
    let updateExpression = [];
    updateExpression.push("updatedAt=:updatedAt");
    updateExpression.push("title=:title");

    let expressionAttributeValues: Record<string, AttributeValue> = {};
    expressionAttributeValues[":updatedAt"] = marshall(
      new Date().toUTCString()
    );
    expressionAttributeValues[":title"] = marshall(updatedData.title);

    if (updatedData.coverPhoto) {
      updateExpression.push("coverPhoto=:coverPhoto");
      expressionAttributeValues[":coverPhoto"] = marshall(
        updatedData.coverPhoto
      );
    }

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.mapsTableName,
      Key: {
        mapId: { ...marshall(id) },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(mapId)",
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Attributes) return null;

    return unmarshall(commandResponse.Attributes);
  }
}
