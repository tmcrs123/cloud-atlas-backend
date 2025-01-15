import { asClass, Resolver } from "awilix";
import {
  DynamoDbImagesRepository,
  ImagesRepository,
} from "../repositories/index.js";
import { ImagesService } from "../services/index.js";

export type ImagesModuleDependencies = {
  imagesRepository: ImagesRepository;
  imagesService: ImagesService;
};

type ImagesDiConfig = Record<keyof ImagesModuleDependencies, Resolver<any>>;
export type ImagesInjectableDependencies = ImagesModuleDependencies;

export function resolveImagesDiConfig(): ImagesDiConfig {
  return {
    imagesRepository: asClass(DynamoDbImagesRepository, {
      lifetime: "SINGLETON",
    }),
    imagesService: asClass(ImagesService, { lifetime: "SINGLETON" }),
  };
}
