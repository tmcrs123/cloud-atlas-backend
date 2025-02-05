import type { Routes } from '../../../shared/types/common-types.js'
import { createImageDetailsInDb, deleteImageFromMarker, getImagesForAtlas, getImagesForMarker, updateImage, uploadImage } from '../controllers/images-controller.js'
import { CREATE_IMAGE_IN_DB_SCHEMA, DELETE_IMAGE_FROM_MARKER_SCHEMA, GET_IMAGES_FOR_ATLAS_SCHEMA, GET_IMAGES_FOR_MARKER_SCHEMA, GET_PRESIGNED_URL_SCHEMA, UPDATE_IMAGE_REQUEST_BODY_SCHEMA, UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA } from '../schemas/images-schema.js'

export const getImagesRoutes = (isLocalEnv: boolean): { routes: Routes } => {
  const prodRoutes = [
    {
      method: 'GET',
      url: '/images/:atlasId/:markerId/markers',
      handler: getImagesForMarker,
      schema: {
        params: GET_IMAGES_FOR_MARKER_SCHEMA,
      },
    },
    {
      method: 'GET',
      url: '/images/:atlasId/atlas',
      handler: getImagesForAtlas,
      schema: {
        params: GET_IMAGES_FOR_ATLAS_SCHEMA,
      },
    },
    {
      method: 'GET',
      url: '/images/:atlasId/:markerId',
      handler: uploadImage,
      schema: {
        params: GET_PRESIGNED_URL_SCHEMA,
      },
    },
    {
      method: 'DELETE',
      url: '/images/:atlasId/:markerId/:imageId',
      handler: deleteImageFromMarker,
      schema: {
        params: DELETE_IMAGE_FROM_MARKER_SCHEMA,
      },
    },
    {
      method: 'POST',
      url: '/images/:atlasId/:imageId',
      handler: updateImage,
      schema: {
        params: UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA,
        body: UPDATE_IMAGE_REQUEST_BODY_SCHEMA,
      },
    },
  ]

  const localRoutes = [
    {
      method: 'POST',
      url: '/upload/:atlasId/:markerId/:imageId',
      handler: createImageDetailsInDb,
      Schema: {
        params: CREATE_IMAGE_IN_DB_SCHEMA,
      },
    },
  ]

  const routes = [...prodRoutes, ...(isLocalEnv ? localRoutes : [])]

  return {
    routes,
  }
}
