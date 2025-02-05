import type { Routes } from '../../../shared/types/common-types.js'
import { createAtlas, getAtlasDetails, getAtlasForUser, deleteAtlas, updateAtlas } from '../controllers/atlas-controller.js'
import { CREATE_ATLAS_REQUEST_BODY_SCHEMA, DELETE_ATLAS_REQUEST_PARAMS_SCHEMA, GET_ATLAS_REQUEST_PARAMS_SCHEMA, UPDATE_ATLAS_REQUEST_BODY_SCHEMA, UPDATE_ATLAS_REQUEST_PARAMS_SCHEMA } from '../schemas/atlas-schema.js'

export const getAtlasRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: 'POST',
        url: '/atlas',
        handler: createAtlas,
        schema: {
          body: CREATE_ATLAS_REQUEST_BODY_SCHEMA,
          description: 'Create a new atlas for the current user',
        },
      },
      {
        method: 'GET',
        url: '/atlas/:atlasIds',
        handler: getAtlasDetails,
        schema: {
          params: GET_ATLAS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: 'GET',
        url: '/atlas',
        handler: getAtlasForUser,
      },
      {
        method: 'DELETE',
        url: '/atlas/:atlasId',
        handler: deleteAtlas,
        schema: {
          params: DELETE_ATLAS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: 'PUT',
        url: '/atlas/:atlasId',
        handler: updateAtlas,
        schema: {
          body: UPDATE_ATLAS_REQUEST_BODY_SCHEMA,
          params: UPDATE_ATLAS_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  }
}
