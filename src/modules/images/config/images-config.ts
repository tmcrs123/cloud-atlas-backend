import { asClass, Resolver } from "awilix";
import {
  DynamoDbImagesRepository,
  ImagesRepository,
} from "../repositories/index.js";
import { ImagesService, ImagesURLsService } from "../services/index.js";
import { AwsImagesURLsService } from "../services/aws-image-urls-service.js";
import {
  DynamoDbMarkersRepository,
  MarkersRepository,
} from "../../markers/repositories/index.js";

export type ImagesModuleDependencies = {
  imagesService: ImagesService;
  imagesRepository: ImagesRepository;
  markersRepository: MarkersRepository;
  imagesURLsService: ImagesURLsService;
};

type ImagesDiConfig = Record<keyof ImagesModuleDependencies, Resolver<any>>;
export type ImagesInjectableDependencies = ImagesModuleDependencies;

export function resolveImagesDiConfig(): ImagesDiConfig {
  return {
    imagesService: asClass(ImagesService, {
      lifetime: "SINGLETON",
    }),
    imagesRepository: asClass(DynamoDbImagesRepository, {
      lifetime: "SINGLETON",
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: "SINGLETON",
    }),
    imagesURLsService: asClass(AwsImagesURLsService, { lifetime: "SINGLETON" }),
  };
}
