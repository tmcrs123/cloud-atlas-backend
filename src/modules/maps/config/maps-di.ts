import { asClass, asFunction, Resolver } from "awilix";
import { dbEngines, MapsRepository } from "../repositories/maps-repository";
import { MapsService } from "../services/maps-service";
import { DatabaseConfig } from "../../../configs";

export type MapsModuleDependencies = {
  mapsRepository: MapsRepository;
  mapsService: MapsService;
};

type MapsDiConfig = Record<keyof MapsModuleDependencies, Resolver<any>>;
export type MapsInjectableDependencies = MapsModuleDependencies;

export function resolveMapsDiConfig({engine}: DatabaseConfig): MapsDiConfig {
  return {
    mapsRepository: asClass(dbEngines[engine], { lifetime: "SINGLETON" }),
    mapsService: asClass(MapsService, { lifetime: "SINGLETON" }),
    // mapsRepository: asFunction(() => {
    //   return {
    //     createMap: () => {
    //       console.log('fake create map')
    //     }
    //   }
    // }, {lifetime: "SINGLETON"})
  };
}
