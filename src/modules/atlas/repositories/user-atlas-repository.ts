import type { Atlas, AtlasOwnership } from '../schemas/atlas-schema.js'

export interface UserAtlasRepository {
  getAtlasByUserId(userId: string): Promise<Atlas[]>
  createAtlasOwnership(owner: string, atlasId: string): Promise<AtlasOwnership>
  deleteAtlasOwnership(userId: string, atlasId: string): Promise<void>
}
