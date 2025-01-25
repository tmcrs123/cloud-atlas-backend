import { asClass, Resolver } from "awilix";
import {
  DynamoDbMarkersRepository,
  MarkersRepository,
} from "../../markers/repositories/index.js";
import {
  DynamoDbImagesRepository,
  ImagesRepository,
} from "../repositories/index.js";
import { AwsImagesURLsService } from "../services/aws-image-urls-service.js";
import { ImagesService, ImagesURLsService } from "../services/index.js";
import { AppConfig } from "../../../shared/configs/app-config.js";
import { SecretsService } from "../../../infrastructure/secrets/interfaces/index.js";
import { AwsSecretsService } from "../../../infrastructure/secrets/implementations/aws-secrets-service.js";
import { MockImageUrlsService } from "../services/mock-image-urls-service.js";

export type ImagesModuleDependencies = {
  appConfig: AppConfig;
  imagesService: ImagesService;
  imagesRepository: ImagesRepository;
  markersRepository: MarkersRepository;
  imagesURLsService: ImagesURLsService;
  secretsService: SecretsService;
};

type ImagesDiConfig = Record<keyof ImagesModuleDependencies, Resolver<any>>;
export type ImagesInjectableDependencies = ImagesModuleDependencies;

export function resolveImagesDiConfig(isLocalEnv: boolean): ImagesDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    imagesService: asClass(ImagesService, {
      lifetime: "SINGLETON",
    }),
    imagesRepository: asClass(DynamoDbImagesRepository, {
      lifetime: "SINGLETON",
    }),
    markersRepository: asClass(DynamoDbMarkersRepository, {
      lifetime: "SINGLETON",
    }),
    imagesURLsService: asClass(
      isLocalEnv ? MockImageUrlsService : AwsImagesURLsService,
      { lifetime: "SINGLETON" }
    ),
    secretsService: asClass(AwsSecretsService, { lifetime: "SINGLETON" }),
  };
}
