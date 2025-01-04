import { MapsRepository } from "./maps-repository";

export class DynamoDbMapsRepository implements MapsRepository {
    async createMap(): Promise<string> {
        return new Promise((resolve) => resolve('all the way to dynamo mapsRepo!!'));
      }
}