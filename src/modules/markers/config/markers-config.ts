import { asClass, Resolver } from "awilix";
import { AppConfig, DatabaseConfig } from "../../../shared/configs/index.js";
import {
  DynamoDbMarkersRepository,
  MarkersRepository,
} from "../repositories/index.js";
import { MarkersService } from "../services/index.js";

export type MarkersModuleDependencies = {
  appConfig: AppConfig;
  markersRepository: MarkersRepository;
  markersService: MarkersService;
};

type MarkersDiConfig = Record<keyof MarkersModuleDependencies, Resolver<any>>;
export type MarkersInjectableDependencies = MarkersModuleDependencies;

export function resolveMarkersDiConfig({
  engine,
}: DatabaseConfig): MarkersDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: "SINGLETON",
    }),
    markersService: asClass(MarkersService, { lifetime: "SINGLETON" }),
    // mapsRepository: asFunction(() => {
    //   return {
    //     createMap: () => {
    //       console.log('fake create map')
    //     }
    //   }
    // }, {lifetime: "SINGLETON"})
  };
}
