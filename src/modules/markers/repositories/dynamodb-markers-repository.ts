import {
  BatchWriteItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { sendCommand } from "../../../db/utils/index.js";
import {
  CreateSnappinMarkerDTO,
  SnappinMarker,
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
}
