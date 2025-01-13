import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import DatabaseGenericError from "../../../errors/database-generic-error.js";
import { CreateMapDTO, SnappinMap } from "../schemas/index.js";
import { MapsRepository } from "./maps-repository.js";

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

  async createMap(createMapDto: CreateMapDTO): Promise<SnappinMap> {
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

    return { ...mapToCreate };
  }

  async getMap(id: string): Promise<SnappinMap> {
    const command = new GetItemCommand({
      TableName: "maps",
      Key: {
        id: { ...marshall(id) },
      },
    });

    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    if (!commandResponse.Item)
      throw new DatabaseGenericError("Entity not found", 404);
    return unmarshall(commandResponse.Item) as SnappinMap;
  }

  async deleteMap(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: "maps",
      Key: {
        id: { ...marshall(id) },
      },
    });
    const commandResponse = await sendCommand(() =>
      this.dynamoClient.send(command)
    );

    return;
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
