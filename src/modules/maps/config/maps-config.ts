import { asClass, asFunction, Resolver } from "awilix";
import { dbEngines, MapsRepository } from "../repositories/index.js";
import { MapsService } from "../services/index.js";
import { AppConfig, DatabaseConfig } from "../../../shared/configs/index.js";
import { DynamoDbMapsRepository } from "../repositories/index.js";

export type MapsModuleDependencies = {
  mapsRepository: MapsRepository;
  mapsService: MapsService;
};

type MapsDiConfig = Record<keyof MapsModuleDependencies, Resolver<any>>;
export type MapsInjectableDependencies = MapsModuleDependencies;

export function resolveMapsDiConfig({ engine }: DatabaseConfig): MapsDiConfig {
  return {
    mapsRepository: asClass(DynamoDbMapsRepository, {
      lifetime: "SINGLETON",
    }),
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

// async function resolveClass(className: string) {
//   const filename = className.toLowerCase()
//   const classname= `${className}MapsRepository`
//   const module = await import(`../repositories/${className.toLowerCase()}-maps-repository.ts`);
//   const ClassRef = module[className];

//   if (!ClassRef) {
//     throw new Error(`Class not found: ${className}`);
//   }

//   return ClassRef;
// }

// function resolveClass2<T>(ClassType: { new (): T }): T {
//   return new ClassType();
// }
