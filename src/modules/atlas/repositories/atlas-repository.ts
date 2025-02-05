import type { Atlas, CreateAtlasDTO, UpdateAtlasDTO } from '../schemas/atlas-schema.js'

export interface AtlasRepository {
  createAtlas(createAtlasDto: CreateAtlasDTO): Promise<Partial<Atlas>>
  getAtlasDetails(AtlasIds: string[]): Promise<Atlas[]>
  deleteAtlas(id: string): Promise<void>
  updateAtlas(updatedData: UpdateAtlasDTO, id: string): Promise<Partial<Atlas>>
}
