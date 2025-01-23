import { asClass, Resolver } from "awilix";
import {
  DynamoDbMapsRepository,
  MapsRepository,
} from "../repositories/index.js";
import { MapsService } from "../services/index.js";

export type MapsModuleDependencies = {
  mapsRepository: MapsRepository;
  mapsService: MapsService;
};

type MapsDiConfig = Record<keyof MapsModuleDependencies, Resolver<any>>;
export type MapsInjectableDependencies = MapsModuleDependencies;

export function resolveMapsDiConfig(): MapsDiConfig {
  return {
    mapsRepository: asClass(DynamoDbMapsRepository, {
      lifetime: "SINGLETON",
    }),
    mapsService: asClass(MapsService, { lifetime: "SINGLETON" }),
  };
}
