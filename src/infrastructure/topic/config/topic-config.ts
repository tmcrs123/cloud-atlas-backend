import { asClass, Resolver } from "awilix";
import { AppConfig } from "../../../shared/configs/index.js";
import { AwsSnsTopic } from "../implementations/aws-sns-topic.js";
import { Topic } from "../interfaces/topic.js";

export type TopicInfrastructureDependencies = {
  appConfig: AppConfig;
  topic: Topic;
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
    topic: asClass(AwsSnsTopic, { lifetime: "SINGLETON" }),
  };
}
