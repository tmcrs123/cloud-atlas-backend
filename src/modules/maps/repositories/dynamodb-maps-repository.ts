import { CREATE_MAP_SCHEMA_TYPE, CreateMapDTO, Map } from "../schemas";
import { MapsRepository } from "./maps-repository";
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

export class DynamoDbMapsRepository implements MapsRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async createMap(createMapDto: CreateMapDTO): Promise<Map> {
    const createMapCommand = new PutItemCommand({
      Item: {
        id: {
          S: createMapDto.title,
        },
      },
      TableName: "maps",
    });

    const createMapDynamoRes = await this.dynamoClient.send(createMapCommand);
    console.log(JSON.stringify(createMapDynamoRes));

    return {
      createdAt: "",
      id: "123",
      markersCount: 12,
      title: "Dynamo db repo maps",
    };
  }
}
