import { asClass, Resolver } from "awilix";
import { MapsService } from "../maps/services/maps-service.js";
import { MarkersService } from "../markers/services/markers-service.js";
import { AppConfig } from "../../shared/configs/index.js";
import { ImagesService, ImagesURLsService } from "../images/services/index.js";
import { AwsImagesURLsService } from "../images/services/aws-image-urls-service.js";

export type DomainModuleDependencies = {
  appConfig: AppConfig;
  mapsService: MapsService;
  imagesService: ImagesService;
  markersService: MarkersService;
  imageURLsService: ImagesURLsService;
};

type DomainDiConfig = Record<keyof DomainModuleDependencies, Resolver<any>>;
export type DomainInjectableDependencies = DomainModuleDependencies;

export function resolveImagesDiConfig(): DomainDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
    mapsService: asClass(MapsService, {
      lifetime: "SINGLETON",
    }),
    markersService: asClass(MarkersService, {
      lifetime: "SINGLETON",
    }),
    imagesService: asClass(ImagesService, {
      lifetime: "SINGLETON",
    }),
    imageURLsService: asClass(AwsImagesURLsService, {
      lifetime: "SINGLETON",
    }),
  };
}
