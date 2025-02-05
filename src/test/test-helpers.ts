import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { CreateImageInDbRequestParams, Image } from '../modules/images/schemas/images-schema.js'
import type { Atlas, CreateAtlasRequestBody } from '../modules/atlas/schemas/atlas-schema.js'
import type { Marker, CreateMarkersRequestBody } from '../modules/markers/schemas/markers-schema.js'

//create atlas
export async function createMapHelper(app: FastifyInstance): Promise<Atlas> {
  const createMapRequestBody = { title: 'bananas' } as CreateAtlasRequestBody
  const response = await app.inject().post('/atlas').body(createMapRequestBody).end()
  return JSON.parse(response.body)
}

export async function createMarkersHelper(app: FastifyInstance, atlasId: string): Promise<Marker[]> {
  const createMarkersRequestBody = {
    markers: [{ coordinates: { lat: 0, lng: 0 }, title: 'some title for a marker' }],
  } as CreateMarkersRequestBody
  const response = await app.inject().post(`/markers/${atlasId}`).body(createMarkersRequestBody).end()
  return JSON.parse(response.body)
}

export async function addImagesHelper(app: FastifyInstance, atlasId: string, markerId: string): Promise<Image> {
  const imageId = randomUUID()
  const createImageInDbRequest = {
    imageId: randomUUID(),
    atlasId,
    markerId,
  } as CreateImageInDbRequestParams
  const response = await app.inject().post(`/upload/${atlasId}/${markerId}/${imageId}`).body(createImageInDbRequest).end()
  return JSON.parse(response.body)
}
