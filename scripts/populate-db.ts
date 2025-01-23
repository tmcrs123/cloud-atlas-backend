import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";
import { Map } from "../src/modules/maps/schemas/maps-schema.js";
import { Marker } from "../src/modules/markers/schemas/markers-schema.js";

async function populateDb() {
  const dynamoClient = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "us-east-1",
    credentials: {
      accessKeyId: "bsas",
      secretAccessKey: "wewfe",
    },
  });

  const randomMaps = [];
  const commands = [];

  for (let index = 0; index < 10; index++) {
    let map = generateRandomMap();
    randomMaps.push(map);
    commands.push(
      new PutItemCommand({
        TableName: "snappin-maps",
        Item: marshall(map),
      })
    );
  }

  const randomMarkers: Marker[] = [];
  const markerCommands: PutItemCommand[] = [];

  randomMaps.forEach((map) => {
    let marker = generateRandomMarkerForMap(map.mapId);
    randomMarkers.push(marker);
    markerCommands.push(
      new PutItemCommand({
        TableName: "snappin-markers",
        Item: marshall(marker),
      })
    );
  });

  const imagesCommands: PutItemCommand[] = [];

  randomMarkers.forEach((marker) => {
    for (let index = 0; index < 7; index++) {
      imagesCommands.push(
        new PutItemCommand({
          TableName: "snappin-images",
          Item: marshall({
            mapId: marker.mapId,
            markerId: marker.markerId,
            imageId: `${randomUUID()}`,
          }),
        })
      );
    }
  });

  try {
    for await (const command of commands) {
      dynamoClient.send(command);
    }

    for await (const command of markerCommands) {
      dynamoClient.send(command);
    }

    for await (const command of imagesCommands) {
      dynamoClient.send(command);
    }
  } catch (error) {
    throw error;
  }
}

function generateRandomMap(): Map {
  return {
    mapId: randomUUID(),
    title: `Map-${Math.floor(Math.random() * 1000)}`,
    claims: ["EDIT"],
    markersCount: 0,
    owner: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateRandomMarkerForMap(mapId: string): Marker {
  return {
    mapId,
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
