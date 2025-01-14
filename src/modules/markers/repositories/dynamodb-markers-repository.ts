import {
  AttributeValue,
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/index.js";
import {
  CreateSnappinMarkerDTO,
  SnappinMarker,
  UpdateMarkerDTO,
} from "../schemas/markers-schema.js";
import { MarkersRepository } from "./index.js";

export class DynamoDbMarkersRepository implements MarkersRepository {
  private dynamoClient: DynamoDBClient;

  constructor() {
    this.dynamoClient = new DynamoDBClient({
      endpoint: "http://localhost:8000",
    });
  }

  async createMarker(createMarkerDTO: CreateSnappinMarkerDTO) {
    const marker: Partial<SnappinMarker> = {
      ...createMarkerDTO,
      createdAt: new Date().toUTCString(),
    };

    const command = new PutItemCommand({
      TableName: "markers",
      Item: marshall(marker),
    });

    const response = await sendCommand(() => this.dynamoClient.send(command));
    return marker;
  }

  async createManyMarkers(createMarkerDTOs: CreateSnappinMarkerDTO[]) {
    const newMarkers = createMarkerDTOs.map((dto: CreateSnappinMarkerDTO) => {
      return {
        PutRequest: {
          Item: marshall({ ...dto }),
        },
      };
    });
    const createMarkersBatchWriteCommandInput = {
      RequestItems: {
        markers: newMarkers,
      },
    };

    const command = new BatchWriteItemCommand(
      createMarkersBatchWriteCommandInput
    );

    const response = await sendCommand(() => this.dynamoClient.send(command));
    console.log(response);
    return;
  }

  async getMarker(id: string): Promise<Partial<SnappinMarker> | null> {
    const command = new GetItemCommand({
      TableName: "markers",
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

  async deleteMarker(id: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: "markers",
      Key: {
        id: { ...marshall(id) },
      },
    });
    await sendCommand(() => this.dynamoClient.send(command));

    return;
  }

  async updateMarker(
    id: string,
    updatedData: UpdateMarkerDTO
  ): Promise<Partial<SnappinMarker> | null> {
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
      TableName: "markers",
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

    return unmarshall(commandResponse.Attributes);
  }
}
