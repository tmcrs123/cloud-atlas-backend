import { MapsRepository } from "./maps-repository";

export class PostgresMapsRepository implements MapsRepository {
    async createMap(): Promise<string> {
        return new Promise((resolve) => resolve('all the way to postgres mapsRepo!!'));
      }
}