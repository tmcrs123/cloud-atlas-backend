import { asClass, Resolver } from "awilix";
import {
  DynamoDbMapsRepository,
  MapsRepository,
} from "../repositories/index.js";
import { MapsService } from "../services/index.js";
import { AppConfig } from "../../../shared/configs/app-config.js";
import { UserMapsRepository } from "../repositories/user-maps-repository.js";
import { DynamoDbUserMapsRepository } from "../repositories/dynamodb-user-maps-repository.js";

export type MapsModuleDependencies = {
  appConfig: AppConfig;
  mapsRepository: MapsRepository;
  userMapsRepository: UserMapsRepository;
  mapsService: MapsService;
};

type MapsDiConfig = Record<keyof MapsModuleDependencies, Resolver<any>>;
export type MapsInjectableDependencies = MapsModuleDependencies;

export function resolveMapsDiConfig(): MapsDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
    mapsRepository: asClass(DynamoDbMapsRepository, {
      lifetime: "SINGLETON",
    }),
    userMapsRepository: asClass(DynamoDbUserMapsRepository, {
      lifetime: "SINGLETON",
    }),
    mapsService: asClass(MapsService, { lifetime: "SINGLETON" }),
  };
}
