import type { PutItemCommand } from '@aws-sdk/client-dynamodb'
import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getApp } from '../app.js'
import * as sendCommandUtil from '../db/utils/sendCommand.js'
import type { AtlasRepository } from '../modules/atlas/repositories/atlas-repository.js'
import type { UserAtlasRepository } from '../modules/atlas/repositories/user-atlas-repository.js'
import type { Atlas, CreateAtlasRequestBody } from '../modules/atlas/schemas/atlas-schema.js'
import type { AtlasService } from '../modules/atlas/services/atlas-service.js'
import type { DomainService } from '../modules/domain/services/domain-service.js'
import type { ImagesService } from '../modules/images/services/images-service.js'
import type { Marker } from '../modules/markers/schemas/markers-schema.js'
import type { MarkersService } from '../modules/markers/services/markers-service.js'
import * as stripPropertiesUtil from '../utils/stripProperties.js'
import * as testHelpers from './test-helpers.js'
describe('atlas actions', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getApp()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it('allows creating an atlas', async () => {
    //setup
    const createAtlasRequestBody = { title: 'bananas' } as CreateAtlasRequestBody
    const expectedMap = {
      claims: ['EDIT'],
      title: createAtlasRequestBody.title,
      atlasId: expect.any(String),
      markersCount: 0,
      owner: process.env.USER_ID,
      createdAt: expect.stringContaining('GMT'),
    }

    const domainServiceCreateMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'createAtlas')
    const stripPropertiesSpy = vi.spyOn(stripPropertiesUtil, 'stripProperties')
    const mapsServiceCreateMapSpy = vi.spyOn(app.diContainer.resolve<AtlasService>('mapsService'), 'createAtlas')
    const mapsRepositoryCreateMapSpy = vi.spyOn(app.diContainer.resolve<AtlasRepository>('mapsRepository'), 'createAtlas')
    const userMapsRepositoryCreateMapOwnershipSpy = vi.spyOn(app.diContainer.resolve<UserAtlasRepository>('userMapsRepository'), 'createAtlasOwnership')
    const sendCommandUtilSpy = vi.spyOn(sendCommandUtil, 'sendCommand')

    //controller
    const response = await app.inject().post('/maps').body(createAtlasRequestBody).end()

    expect(response.statusCode).toBe(201)
    const responseBody = JSON.parse(response.body)
    expect(Object.keys(responseBody)).toStrictEqual(['claims', 'title', 'atlasId', 'createdAt', 'markersCount'])
    expect(response.headers.location).toBeTruthy()

    // domainService
    expect(domainServiceCreateMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceCreateMapSpy).toHaveBeenCalledWith(createAtlasRequestBody, process.env.USER_ID)
    expect(stripPropertiesSpy).toHaveBeenCalledOnce()
    expect(stripPropertiesSpy).toBeCalledWith(expect.anything(), ['owner'])

    //mapsService
    expect(mapsServiceCreateMapSpy).toHaveBeenCalledOnce()
    expect(mapsServiceCreateMapSpy).toHaveBeenCalledWith(createAtlasRequestBody.title, process.env.USER_ID)
    expect(mapsServiceCreateMapSpy).toHaveReturnedWith(expect.any(Promise<Atlas>))

    expect(mapsRepositoryCreateMapSpy).toHaveBeenCalledOnce()
    expect(mapsRepositoryCreateMapSpy).toHaveBeenCalledWith(expectedMap)
    expect(userMapsRepositoryCreateMapOwnershipSpy).toHaveBeenCalledOnce()
    expect(userMapsRepositoryCreateMapOwnershipSpy).toHaveBeenCalledWith(process.env.USER_ID, expect.any(String))

    expect(sendCommandUtilSpy).toBeCalledTimes(1)
    expect(sendCommandUtilSpy).toHaveBeenCalledWith(expect.any(Function))
    expect(sendCommandUtilSpy).toHaveReturnedWith(expect.any(Promise<PutItemCommand>))
  })

  it('allows deleting map', async () => {
    //setup
    const map = await testHelpers.createMapHelper(app)
    const markers = await testHelpers.createMarkersHelper(app, map.atlasId)
    const image = await testHelpers.addImagesHelper(app, map.atlasId, markers[0].markerId)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteAtlas')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')
    const imagesServiceGetImagesForMapSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'getImagesForAtlas')
    const imagesServiceDeleteImagesSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'deleteImages')

    //ACT
    const response = await app.inject().delete(`/maps/${map.atlasId}`).end()

    //ASSERT

    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.atlasId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.atlasId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledWith([markers[0].markerId], map.atlasId)

    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledOnce()
    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledWith(map.atlasId)

    expect(imagesServiceDeleteImagesSpy).toHaveBeenCalledOnce()
    expect(imagesServiceDeleteImagesSpy).toHaveBeenCalledWith(map.atlasId, [image.imageId])
  })

  it('does nothing else after deleting map if map has no markers', async () => {
    //setup
    const map = await testHelpers.createMapHelper(app)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteAtlas')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')

    //ACT
    const response = await app.inject().delete(`/maps/${map.atlasId}`).end()

    //ASSERT
    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.atlasId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.atlasId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).not.toHaveBeenCalled()
  })

  it('does nothing else after deleting map and markers if map has no images', async () => {
    //setup
    const map = await testHelpers.createMapHelper(app)
    const markers = await testHelpers.createMarkersHelper(app, map.atlasId)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteAtlas')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')
    const imagesServiceGetImagesForMapSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'getImagesForAtlas')
    const imagesServiceDeleteImagesSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'deleteImages')

    //ACT
    const response = await app.inject().delete(`/maps/${map.atlasId}`).end()

    //ASSERT

    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.atlasId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.atlasId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledWith([markers[0].markerId], map.atlasId)

    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledOnce()
    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledWith(map.atlasId)

    expect(imagesServiceDeleteImagesSpy).not.toHaveBeenCalled()
  })
})
