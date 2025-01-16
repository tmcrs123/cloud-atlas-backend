import { asClass, Resolver } from "awilix";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesService } from "../../../modules/images/services/index.js";

export type QueueInfrastructureDependencies = {
  appConfig: AppConfig;
  imagesService: ImagesService;
};

type QueueDiConfig = Record<
  keyof QueueInfrastructureDependencies,
  Resolver<any>
>;
export type QueueInjectableDependencies = QueueInfrastructureDependencies;

export function resolveImagesDiConfig(): QueueDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    imagesService: asClass(ImagesService, { lifetime: "SINGLETON" }),
  };
}
