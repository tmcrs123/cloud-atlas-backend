import { type AttributeValue, BatchGetItemCommand, DeleteItemCommand, DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import { sendCommand } from '../../../db/utils/sendCommand.js'
import type { AppConfig } from '../../../shared/configs/app-config.js'
import type { AtlasInjectableDependencies } from '../config/atlas-config.js'
import type { Atlas, CreateAtlasDTO, UpdateAtlasDTO } from '../schemas/atlas-schema.js'
import type { AtlasRepository } from './atlas-repository.js'

export class DynamoDbAtlasRepository implements AtlasRepository {
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

  async createAtlas(createAtlasDto: CreateAtlasDTO): Promise<Partial<Atlas>> {
    const command = new PutItemCommand({
      TableName: this.appConfig.configurations.atlasTableName,
      Item: marshall(createAtlasDto),
    })

    await sendCommand(() => this.dynamoClient.send(command))
    return {
      ...createAtlasDto,
    }
  }

  async getAtlasDetails(atlasIds: string[]): Promise<Atlas[]> {
    if (!atlasIds || atlasIds.length === 0) return []

    const command = new BatchGetItemCommand({
      RequestItems: {
        [this.appConfig.configurations.atlasTableName]: {
          Keys: atlasIds.map((id) => ({ atlasId: { S: id } })),
        },
      },
    })

    const commandResponse = await sendCommand(() => this.dynamoClient.send(command))

    if (!commandResponse.Responses) return []

    return commandResponse.Responses[this.appConfig.configurations.atlasTableName].map((item: AttributeValue | Record<string, AttributeValue>) => unmarshall(item) as Atlas)
  }

  async deleteAtlas(atlasId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: this.appConfig.configurations.atlasTableName,
      Key: {
        atlasId: { ...marshall(atlasId) },
      },
    })
    await sendCommand(() => this.dynamoClient.send(command))

    return
  }

  async updateAtlas(updatedData: UpdateAtlasDTO, id: string): Promise<Partial<Atlas>> {
    const updateExpression = []
    updateExpression.push('updatedAt=:updatedAt')
    updateExpression.push('title=:title')

    const expressionAttributeValues: Record<string, AttributeValue> = {}
    expressionAttributeValues[':updatedAt'] = marshall(new Date().toUTCString())
    expressionAttributeValues[':title'] = marshall(updatedData.title)

    if (updatedData.coverPhoto) {
      updateExpression.push('coverPhoto=:coverPhoto')
      expressionAttributeValues[':coverPhoto'] = marshall(updatedData.coverPhoto)
    }

    const command = new UpdateItemCommand({
      TableName: this.appConfig.configurations.atlasTableName,
      Key: {
        atlasId: { ...marshall(id) },
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(atlasId)',
    })

    const commandResponse = await sendCommand(() => this.dynamoClient.send(command))

    return unmarshall(commandResponse.Attributes!)
  }
}
