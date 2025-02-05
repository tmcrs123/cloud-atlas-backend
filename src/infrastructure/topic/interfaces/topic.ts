export interface TopicService {
  pushMessageToTopic(atlasId: string, markerId: string, imageId: string): void
}
