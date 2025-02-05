import { randomUUID } from 'node:crypto'
import type { AtlasInjectableDependencies } from '../config/atlas-config.js'
import type { AtlasRepository } from '../repositories/atlas-repository.js'
import type { UserAtlasRepository } from '../repositories/user-atlas-repository.js'
import type { Atlas } from '../schemas/atlas-schema.js'

export class AtlasService {
  private readonly atlasRepository: AtlasRepository
  private readonly userAtlasRepository: UserAtlasRepository

  constructor({ atlasRepository, userAtlasRepository }: AtlasInjectableDependencies) {
    this.atlasRepository = atlasRepository
    this.userAtlasRepository = userAtlasRepository
  }

  async createAtlas(title: string, owner: string): Promise<Partial<Atlas>> {
    const atlasId = randomUUID()
    const Atlas = await this.atlasRepository.createAtlas({
      claims: ['EDIT'],
      title,
      atlasId,
      createdAt: new Date().toUTCString(),
      markersCount: 0,
      owner,
    })

    await this.userAtlasRepository.createAtlasOwnership(owner, atlasId)

    return Atlas
  }

  async getAtlasByOwner(owner: string): Promise<Atlas[]> {
    const availableAtlas = await this.userAtlasRepository.getAtlasByUserId(owner)
    return await this.populateAtlasDetails(availableAtlas.map((a) => a.atlasId))
  }

  async getAtlasDetails(atlasIds: string[]): Promise<Atlas[]> {
    const response = await this.populateAtlasDetails(atlasIds)
    return response
  }

  private async populateAtlasDetails(atlasIds: string[]): Promise<Atlas[]> {
    const response = await this.atlasRepository.getAtlasDetails(atlasIds)
    return response
  }

  async deleteAtlas(userId: string, atlasId: string): Promise<void> {
    await this.atlasRepository.deleteAtlas(atlasId)
    await this.userAtlasRepository.deleteAtlasOwnership(userId, atlasId)
  }

  async updateAtlas(updatedData: Partial<Atlas>, atlasId: string): Promise<Partial<Atlas>> {
    const updatedAtlas = await this.atlasRepository.updateAtlas({ ...updatedData, updatedAt: new Date().toUTCString() }, atlasId)

    return updatedAtlas
  }
}
