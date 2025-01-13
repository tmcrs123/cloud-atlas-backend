import {
  DeleteItemCommand,
  DeleteItemCommandInput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
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

    const createMapCommand = createTypedDynamoDBCommand(
      PutItemCommand,
      "maps",
      mapToCreate
    );

    const createMapDynamoRes = await sendCommand(() =>
      this.dynamoClient.send(createMapCommand)
    );
    console.log(JSON.stringify(createMapDynamoRes));

    return { ...mapToCreate };
  }
}

type DynamoDbInput =
  | PutItemCommandInput
  | GetItemCommandInput
  | DeleteItemCommandInput;

type DynamoDbCommand = PutItemCommand | GetItemCommand | DeleteItemCommand;

type CommandConstructor<
  Input extends DynamoDbInput,
  Command extends DynamoDbCommand
> = new (input: Input) => Command;

function createTypedDynamoDBCommand<
  Z,
  Input extends DynamoDbInput,
  Command extends DynamoDbCommand
>(
  commandTypeCtor: CommandConstructor<Input, Command>,
  tableName: string,
  item: Z
): Command {
  const marshalledItem = marshall(item);
  const input = { TableName: tableName, Item: marshalledItem } as Input;
  return new commandTypeCtor(input);
}

function mapDynamoDbError(err: DynamoDbError): DatabaseGenericError {
  return new DatabaseGenericError(err.message, err.$metadata.httpStatusCode);
}

async function sendCommand<T>(sendFn: () => Promise<T>): Promise<T> {
  try {
    return await sendFn();
  } catch (err) {
    throw mapDynamoDbError(err as DynamoDbError);
  }
}
