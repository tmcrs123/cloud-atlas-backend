import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "node:crypto";
import type { Marker } from "../src/modules/markers/schemas/markers-schema.js";
import type { Atlas } from "../src/modules/atlas/schemas/atlas-schema.js";

async function populateDb() {
  const dynamoClient = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "us-east-1",
    credentials: {
      accessKeyId: "bsas",
      secretAccessKey: "wewfe",
    },
  });

  const randomAtlas = [];
  const atlasCommands = [];
  const ownerCommands = [];

  const owner = "6666-6666-6666-6666";

  for (let index = 0; index < 10; index++) {
    const atlas = generateRandomAtlas(owner);
    randomAtlas.push(atlas);
    atlasCommands.push(
      new PutItemCommand({
        TableName: "ca-dev-atlas",
        Item: marshall(atlas),
      })
    );
    ownerCommands.push(
      new PutItemCommand({
        TableName: "ca-dev-owners",
        Item: marshall({ userId: owner, atlasId: atlas.atlasId }),
      })
    );
  }

  const randomMarkers: Marker[] = [];
  const markerCommands: PutItemCommand[] = [];

  for (const atlas of randomAtlas) {
    for (let index = 0; index < 30; index++) {
      const marker = generateRandomMarkerForAtlas(atlas.atlasId);
      randomMarkers.push(marker);
      markerCommands.push(
        new PutItemCommand({
          TableName: "ca-dev-markers",
          Item: marshall(marker),
        })
      );
    }
  }

  const imagesCommands: PutItemCommand[] = [];

  for (const marker of randomMarkers) {
    for (let index = 0; index < 7; index++) {
      imagesCommands.push(
        new PutItemCommand({
          TableName: "ca-dev-images",
          Item: marshall({
            atlasId: marker.atlasId,
            markerId: marker.markerId,
            imageId: `${randomUUID()}`,
          }),
        })
      );
    }
  }

  for await (const command of atlasCommands) {
    dynamoClient.send(command);
  }

  for await (const command of ownerCommands) {
    dynamoClient.send(command);
  }

  for await (const command of markerCommands) {
    dynamoClient.send(command);
  }

  for await (const command of imagesCommands) {
    dynamoClient.send(command);
  }
}

function generateRandomAtlas(uuid?: string): Atlas {
  return {
    atlasId: randomUUID(),
    title: `Atlas-${Math.floor(Math.random() * 1000)}`,
    claims: ["EDIT"],
    markersCount: 0,
    owner: uuid || randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateRandomMarkerForAtlas(atlasId: string): Marker {
  return {
    atlasId,
    markerId: randomUUID(),
    title: `Marker-${Math.floor(Math.random() * 1000)}`,
    imageCount: 0,
    coordinates: {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

populateDb();
