import { randomUUID } from "node:crypto";
import {
  CREATE_SNAPPIN_SCHEMA_TYPE,
  CreateMapDTO,
  SnappinMap,
} from "../schemas";
import { MapsRepository } from "./maps-repository";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
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
    };

    const createMapCommand = createdTypedPutItemCommand<SnappinMap>("maps", {
      claims: ["EDIT"],
      title: createMapDto.title,
      id: randomUUID(),
      createdAt: new Date().toUTCString(),
      markersCount: 0,
    });

    try {
      const createMapDynamoRes = await this.dynamoClient.send(createMapCommand);
      console.log(JSON.stringify(createMapDynamoRes));
    } catch (error) {
      console.error(error);
    }

    return {
      createdAt: "",
      id: "123",
      markersCount: 12,
      title: "Dynamo db repo maps",
      claims: ["EDIT"],
    };
  }
}

function createdTypedPutItemCommand<T>(tableName: string, item: T) {
  return new PutItemCommand({ Item: marshall(item), TableName: tableName });
}
