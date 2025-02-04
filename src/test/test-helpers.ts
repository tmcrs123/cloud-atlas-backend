import { randomUUID } from 'node:crypto'
import type { FastifyInstance } from 'fastify'
import type { CreateImageInDbRequestParams, Image } from '../modules/images/schemas/images-schema.js'
import type { CreateMapRequestBody, Map } from '../modules/maps/schemas/maps-schema.js'
import type { CreateMarkersRequestBody, Marker } from '../modules/markers/schemas/index.js'

//create map
export async function createMapHelper(app: FastifyInstance): Promise<Map> {
  const createMapRequestBody = { title: 'bananas' } as CreateMapRequestBody
  const response = await app.inject().post('/maps').body(createMapRequestBody).end()
  return JSON.parse(response.body)
}

export async function createMarkersHelper(app: FastifyInstance, mapId: string): Promise<Marker[]> {
  const createMarkersRequestBody = {
    markers: [{ coordinates: { lat: 0, lng: 0 }, title: 'some title for a marker' }],
  } as CreateMarkersRequestBody
  const response = await app.inject().post(`/markers/${mapId}`).body(createMarkersRequestBody).end()
  return JSON.parse(response.body)
}

export async function addImagesHelper(app: FastifyInstance, mapId: string, markerId: string): Promise<Image> {
  const imageId = randomUUID()
  const createImageInDbRequest = {
    imageId: randomUUID(),
    mapId,
    markerId,
  } as CreateImageInDbRequestParams
  const response = await app.inject().post(`/upload/${mapId}/${markerId}/${imageId}`).body(createImageInDbRequest).end()
  return JSON.parse(response.body)
}
