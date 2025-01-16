import { asClass, Resolver } from "awilix";
import { AppConfig } from "../../../shared/configs/index.js";
import { ImagesService } from "../../../modules/images/services/index.js";
import { Queue } from "../queue.js";
import { AwsSNSProcessImageQueue } from "../aws-sns-process-image-queue.js";

export type QueueInfrastructureDependencies = {
  appConfig: AppConfig;
  imagesService: ImagesService;
  queue: Queue;
};

type QueueDiConfig = Record<
  keyof QueueInfrastructureDependencies,
  Resolver<any>
>;
export type QueueInjectableDependencies = QueueInfrastructureDependencies;

export function resolveQueueDiConfig(): QueueDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    imagesService: asClass(ImagesService, { lifetime: "SINGLETON" }),
    queue: asClass(AwsSNSProcessImageQueue, { lifetime: "SINGLETON" }),
  };
}
