import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import DatabaseGenericError from "../../../errors/database-generic-error.js";
import { CreateMapDTO, SnappinMap, UpdateMapDTO } from "../schemas/index.js";
import { MapsRepository } from "./maps-repository.js";
import { stripProperties } from "../../../utils/stripProperties.js";

type DynamoDbError = {
  message: string;
  name: string;
  $metadata: {
    httpStatusCode: number;
    requestId: string;
  };
};

export class DynamoDbMapsRepository implements MapsRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Partial<SnappinMap>> {
    const mapToCreate: SnappinMap = {
      claims: ["EDIT"],
      title: createMapDto.title,
      id: randomUUID(),
      createdAt: new Date().toUTCString(),
      markersCount: 0,
      owner: createMapDto.owner,
    };

    const command = new PutItemCommand({
      TableName: "maps",
      Item: marshall(mapToCreate),
    });

    await sendCommand(() => this.dynamoClient.send(command));

    return stripProperties<Partial<SnappinMap>>({ ...mapToCreate }, ["owner"]);
  }

  async getMap(id: string): Promise<Partial<SnappinMap> | null> {
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
    return stripProperties<Partial<SnappinMap>>(
      unmarshall(commandResponse.Item),
      ["owner"]
    );
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
    id: string,
    updatedData: UpdateMapDTO
  ): Promise<Partial<SnappinMap> | null> {
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
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Attributes) return null;

    return stripProperties<Partial<SnappinMap>>(
      unmarshall(commandResponse.Attributes),
      ["owner"]
    );
  }
}

async function sendCommand<T>(sendFn: () => Promise<T>): Promise<T> {
  try {
    return await sendFn();
  } catch (err) {
    let error = err as DynamoDbError;
    throw new DatabaseGenericError(
      error.message,
      error.$metadata.httpStatusCode
    );
  }
}
