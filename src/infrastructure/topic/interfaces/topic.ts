export interface TopicService {
  pushMessageToTopic(mapId: string, markerId: string, imageId: string): void;
}
