import type { PutItemCommand } from '@aws-sdk/client-dynamodb'
import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getApp } from '../app.js'
import * as sendCommandUtil from '../db/utils/index.js'
import type { DomainService } from '../modules/domain/services/domain-service.js'
import type { ImagesService } from '../modules/images/services/images-service.js'
import type { MapsRepository } from '../modules/maps/repositories/maps-repository.js'
import type { UserMapsRepository } from '../modules/maps/repositories/user-maps-repository.js'
import type { CreateMapRequestBody, Map } from '../modules/maps/schemas/index.js'
import type { MapsService } from '../modules/maps/services/index.js'
import type { Marker } from '../modules/markers/schemas/markers-schema.js'
import type { MarkersService } from '../modules/markers/services/markers-service.js'
import * as stripPropertiesUtil from '../utils/index.js'
import * as testHelpers from './test-helpers.js'
describe('maps actions', () => {
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

  it('allows creating a map', async () => {
    //setup
    const createMapRequestBody = { title: 'bananas' } as CreateMapRequestBody
    const expectedMap = {
      claims: ['EDIT'],
      title: createMapRequestBody.title,
      mapId: expect.any(String),
      markersCount: 0,
      owner: process.env.USER_ID,
      createdAt: expect.stringContaining('GMT'),
    }

    const domainServiceCreateMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'createMap')
    const stripPropertiesSpy = vi.spyOn(stripPropertiesUtil, 'stripProperties')
    const mapsServiceCreateMapSpy = vi.spyOn(app.diContainer.resolve<MapsService>('mapsService'), 'createMap')
    const mapsRepositoryCreateMapSpy = vi.spyOn(app.diContainer.resolve<MapsRepository>('mapsRepository'), 'createMap')
    const userMapsRepositoryCreateMapOwnershipSpy = vi.spyOn(app.diContainer.resolve<UserMapsRepository>('userMapsRepository'), 'createMapOwnership')
    const sendCommandUtilSpy = vi.spyOn(sendCommandUtil, 'sendCommand')

    //controller
    const response = await app.inject().post('/maps').body(createMapRequestBody).end()

    expect(response.statusCode).toBe(201)
    const responseBody = JSON.parse(response.body)
    expect(Object.keys(responseBody)).toStrictEqual(['claims', 'title', 'mapId', 'createdAt', 'markersCount'])
    expect(response.headers.location).toBeTruthy()

    // domainService
    expect(domainServiceCreateMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceCreateMapSpy).toHaveBeenCalledWith(createMapRequestBody, process.env.USER_ID)
    expect(stripPropertiesSpy).toHaveBeenCalledOnce()
    expect(stripPropertiesSpy).toBeCalledWith(expect.anything(), ['owner'])

    //mapsService
    expect(mapsServiceCreateMapSpy).toHaveBeenCalledOnce()
    expect(mapsServiceCreateMapSpy).toHaveBeenCalledWith(createMapRequestBody.title, process.env.USER_ID)
    expect(mapsServiceCreateMapSpy).toHaveReturnedWith(expect.any(Promise<Map>))

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
    const markers = await testHelpers.createMarkersHelper(app, map.mapId)
    const image = await testHelpers.addImagesHelper(app, map.mapId, markers[0].markerId)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteMap')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')
    const imagesServiceGetImagesForMapSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'getImagesForMap')
    const imagesServiceDeleteImagesSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'deleteImages')

    //ACT
    const response = await app.inject().delete(`/maps/${map.mapId}`).end()

    //ASSERT

    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.mapId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.mapId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledWith([markers[0].markerId], map.mapId)

    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledOnce()
    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledWith(map.mapId)

    expect(imagesServiceDeleteImagesSpy).toHaveBeenCalledOnce()
    expect(imagesServiceDeleteImagesSpy).toHaveBeenCalledWith(map.mapId, [image.imageId])
  })

  it('does nothing else after deleting map if map has no markers', async () => {
    //setup
    const map = await testHelpers.createMapHelper(app)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteMap')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')

    //ACT
    const response = await app.inject().delete(`/maps/${map.mapId}`).end()

    //ASSERT
    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.mapId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.mapId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).not.toHaveBeenCalled()
  })

  it('does nothing else after deleting map and markers if map has no images', async () => {
    //setup
    const map = await testHelpers.createMapHelper(app)
    const markers = await testHelpers.createMarkersHelper(app, map.mapId)

    const domainServiceDeleteMapSpy = vi.spyOn(app.diContainer.resolve<DomainService>('domainService'), 'deleteMap')
    const markersServiceGetMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'getMarkers')

    const markersServiceDeleteMarkersSpy = vi.spyOn(app.diContainer.resolve<MarkersService>('markersService'), 'deleteMarkers')
    const imagesServiceGetImagesForMapSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'getImagesForMap')
    const imagesServiceDeleteImagesSpy = vi.spyOn(app.diContainer.resolve<ImagesService>('imagesService'), 'deleteImages')

    //ACT
    const response = await app.inject().delete(`/maps/${map.mapId}`).end()

    //ASSERT

    expect(response.statusCode).toBe(204)

    // domainService
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledOnce()
    expect(domainServiceDeleteMapSpy).toHaveBeenCalledWith(process.env.USER_ID, map.mapId)

    //mapsService
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceGetMarkersSpy).toHaveBeenCalledWith(map.mapId)
    expect(markersServiceGetMarkersSpy).toHaveReturnedWith(expect.any(Promise<Marker[]>))

    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledOnce()
    expect(markersServiceDeleteMarkersSpy).toHaveBeenCalledWith([markers[0].markerId], map.mapId)

    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledOnce()
    expect(imagesServiceGetImagesForMapSpy).toHaveBeenCalledWith(map.mapId)

    expect(imagesServiceDeleteImagesSpy).not.toHaveBeenCalled()
  })
})
