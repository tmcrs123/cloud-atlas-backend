import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/index.js";
import { CreateMapDTO, Map, UpdateMapDTO } from "../schemas/index.js";
import { MapsRepository } from "./maps-repository.js";

export class DynamoDbMapsRepository implements MapsRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Partial<Map>> {
    const command = new PutItemCommand({
      TableName: "maps",
      Item: marshall(createMapDto, {
        removeUndefinedValues: false,
        convertEmptyValues: false,
      }),
    });

    await sendCommand(() => this.dynamoClient.send(command));

    return { ...createMapDto };
  }

  async getMap(id: string): Promise<Partial<Map> | null> {
    const command = new GetItemCommand({
      TableName: "maps",
      Key: {
        id: { ...marshall(id) },
      },
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Item) return null;

    return unmarshall(commandResponse.Item);
  }

  async deleteMap(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: "maps",
      Key: {
        id: { ...marshall(id) },
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
      TableName: "maps",
      Key: {
        id: { ...marshall(id) },
      },
      UpdateExpression: `SET ${updateExpression.join(", ")}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(id)",
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Attributes) return null;

    return unmarshall(commandResponse.Attributes);
  }
}
