import { type AttributeValue, DeleteItemCommand, DynamoDBClient, PutItemCommand, QueryCommand, type QueryCommandOutput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { sendCommand } from '../../../db/utils/sendCommand.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { AtlasInjectableDependencies } from '../config/atlas-config.js'
import type { Atlas, AtlasOwnership } from '../schemas/atlas-schema.js'
import type { UserAtlasRepository } from './user-atlas-repository.js'

export class DynamoDbUserAtlasRepository implements UserAtlasRepository {
  private dynamoClient: DynamoDBClient
  private appConfig: AppConfig

  constructor({ appConfig }: AtlasInjectableDependencies) {
    this.appConfig = appConfig
    this.dynamoClient = new DynamoDBClient({
      ...(this.appConfig.isLocalEnv() && {
        endpoint: this.appConfig.configurations.databaseEndpoint,
        region: this.appConfig.configurations.region,
        credentials: {
          accessKeyId: this.appConfig.configurations.databaseAccessKeyId,
          secretAccessKey: this.appConfig.configurations.databaseSecretAccessKey,
        },
      }),
    })
  }
  async getAtlasByUserId(userId: string): Promise<Atlas[]> {
    const ExpressionAttributeValues: Record<string, AttributeValue> = {
      ':userId': marshall(userId),
    }
    const KeyConditionExpression = 'userId = :userId'

    const command = new QueryCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      ExpressionAttributeValues,
      KeyConditionExpression,
    })

    const commandResponse: QueryCommandOutput = await sendCommand(() => this.dynamoClient.send(command))

    if (!commandResponse.Items || commandResponse.Items.length === 0) return []

    return commandResponse.Items.map((item) => unmarshall(item) as Atlas)
  }

  async createAtlasOwnership(owner: string, atlasId: string): Promise<AtlasOwnership> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      Item: marshall({ userId: owner, atlasId: atlasId }),
    })

    await sendCommand(() => this.dynamoClient.send(command))

    return { userId: owner, atlasId }
  }

  async deleteAtlasOwnership(userId: string, atlasId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.ownersTableName,
      Key: {
        userId: { ...marshall(userId) },
        atlasId: { ...marshall(atlasId) },
      },
    })
    await sendCommand(() => this.dynamoClient.send(command))

    return
  }
}
