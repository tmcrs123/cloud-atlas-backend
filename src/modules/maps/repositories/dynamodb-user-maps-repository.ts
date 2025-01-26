import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  QueryCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { AppConfig } from "../../../shared/configs/index.js";
import { MapsInjectableDependencies } from "../config/maps-config.js";
import { Map, MapOwnership } from "../schemas/index.js";
import { UserMapsRepository } from "./user-maps-repository.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/sendCommand.js";

export class DynamoDbUserMapsRepository implements UserMapsRepository {
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
  async getMapsByUserId(userId: string): Promise<Map[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ":userId": marshall(userId),
    };
    const KeyConditionExpression = "userId = :userId";

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
    });

    const commandResponse: QueryCommandOutput = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Items) return [];

    return commandResponse.Items.map((item) => unmarshall(item) as Map);
  }

  async createMapOwnership(
    owner: string,
    mapId: string
  ): Promise<MapOwnership> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      Item: marshall({ userId: owner, mapId: mapId }),
    });

    await sendCommand(() => this.dynamoClient.send(command));

    return { userId: owner, mapId };
  }

  async deleteMapOwnership(userId: string, mapId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      Key: {
        userId: { ...marshall(userId) },
        mapId: { ...marshall(mapId) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }
}
