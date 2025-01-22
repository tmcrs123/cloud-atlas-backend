import { asClass, Resolver } from "awilix";
import { AppConfig, DatabaseConfig } from "../../../shared/configs/index.js";
import {
  DynamoDbMapsRepository,
  MapsRepository,
} from "../repositories/index.js";
import { MapsService } from "../services/index.js";
import { MarkersService } from "../../markers/services/markers-service.js";
import { ImagesService } from "../../images/services/images-service.js";

export type MapsModuleDependencies = {
  appConfig: AppConfig;
  mapsRepository: MapsRepository;
  mapsService: MapsService;
  markersService: MarkersService;
  imagesService: ImagesService;
};

type MapsDiConfig = Record<keyof MapsModuleDependencies, Resolver<any>>;
export type MapsInjectableDependencies = MapsModuleDependencies;

export function resolveMapsDiConfig({ engine }: DatabaseConfig): MapsDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    mapsRepository: asClass(DynamoDbMapsRepository, {
      lifetime: "SINGLETON",
    }),
    mapsService: asClass(MapsService, { lifetime: "SINGLETON" }),
    markersService: asClass(MarkersService, { lifetime: "SINGLETON" }),
    imagesService: asClass(ImagesService, { lifetime: "SINGLETON" }),
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
