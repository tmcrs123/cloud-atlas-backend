import { asClass, Resolver } from "awilix";
import { AwsSnsTopicService } from "../../infrastructure/topic/implementations/aws-sns-topic.js";
import { TopicService } from "../../infrastructure/topic/interfaces/topic.js";
import { AppConfig } from "../../shared/configs/index.js";
import { ImagesService } from "../images/services/index.js";
import { MapsService } from "../maps/services/maps-service.js";
import { MarkersService } from "../markers/services/markers-service.js";

export type DomainModuleDependencies = {
  appConfig: AppConfig;
  mapsService: MapsService;
  imagesService: ImagesService;
  markersService: MarkersService;
  topicService: TopicService;
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
    topicService: asClass(AwsSnsTopicService, {
      lifetime: "SINGLETON",
    }),
  };
}
