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
import { Topic } from "../../../infrastructure/topic/interfaces/index.js";
import { AwsSnsTopic } from "../../../infrastructure/topic/implementations/aws-sns-topic.js";
import { AppConfig } from "../../../shared/configs/index.js";
import { DomainService } from "../../domain/services/domain-service.js";

export type ImagesModuleDependencies = {
  appConfig: AppConfig;
  imagesService: ImagesService;
  imagesRepository: ImagesRepository;
  markersRepository: MarkersRepository;
  imagesURLsService: ImagesURLsService;
  topic: Topic;
  domainService: DomainService;
};

type ImagesDiConfig = Record<keyof ImagesModuleDependencies, Resolver<any>>;
export type ImagesInjectableDependencies = ImagesModuleDependencies;

export function resolveImagesDiConfig(): ImagesDiConfig {
  return {
    appConfig: asClass(AppConfig, { lifetime: "SINGLETON" }),
    imagesService: asClass(ImagesService, {
      lifetime: "SINGLETON",
    }),
    domainService: asClass(DomainService, {
      lifetime: "SINGLETON",
    }),
    imagesRepository: asClass(DynamoDbImagesRepository, {
      lifetime: "SINGLETON",
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: "SINGLETON",
    }),
    imagesURLsService: asClass(AwsImagesURLsService, { lifetime: "SINGLETON" }),
    topic: asClass(AwsSnsTopic, { lifetime: "SINGLETON" }),
  };
}
