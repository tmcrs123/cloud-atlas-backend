import { asClass, Resolver } from "awilix";
import { AppConfig } from "../../../shared/configs/index.js";
import { AwsSnsTopicService } from "../implementations/aws-sns-topic.js";
import { TopicService } from "../interfaces/topic.js";

export type TopicInfrastructureDependencies = {
  appConfig: AppConfig;
  topicService: TopicService;
};

type TopicDiConfig = Record<
  keyof TopicInfrastructureDependencies,
  Resolver<any>
>;
export type TopicInjectableDependencies = TopicInfrastructureDependencies;

export function resolveTopicDiConfig(): TopicDiConfig {
  return {
    appConfig: asClass(AppConfig, {
      lifetime: "SINGLETON",
    }),
    topicService: asClass(AwsSnsTopicService, { lifetime: "SINGLETON" }),
  };
}
