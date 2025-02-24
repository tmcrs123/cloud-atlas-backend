import type { Routes } from '../../../shared/types/common-types.js'
import { createMarkers, deleteMarkers, getMarker, getMarkers, updateMarker } from '../controllers/markers-controller.js'
import {
  CREATE_MARKERS_REQUEST_BODY_SCHEMA,
  CREATE_MARKERS_REQUEST_PARAMS_SCHEMA,
  DELETE_MARKERS_QUERYSTRING_SCHEMA,
  DELETE_MARKERS_REQUEST_BODY_SCHEMA,
  DELETE_MARKERS_REQUEST_PARAMS_SCHEMA,
  GET_MARKERS_REQUEST_PARAMS_SCHEMA,
  GET_MARKER_REQUEST_PARAMS_SCHEMA,
  UPDATE_MARKER_REQUEST_BODY_SCHEMA,
  UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
} from '../schemas/markers-schema.js'

export const getMarkersRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: 'POST',
        url: '/markers/:atlasId',
        handler: createMarkers,
        schema: {
          body: CREATE_MARKERS_REQUEST_BODY_SCHEMA,
          params: CREATE_MARKERS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: 'GET',
        url: '/markers/:atlasId',
        handler: getMarkers,
        schema: {
          params: GET_MARKERS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: 'GET',
        url: '/markers/:atlasId/:markerId',
        handler: getMarker,
        schema: {
          params: GET_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: 'DELETE',
        url: '/markers/:atlasId',
        handler: deleteMarkers,
        schema: {
          params: DELETE_MARKERS_REQUEST_PARAMS_SCHEMA,
          body: DELETE_MARKERS_REQUEST_BODY_SCHEMA,
          querystring: DELETE_MARKERS_QUERYSTRING_SCHEMA,
        },
      },
      {
        method: 'PUT',
        url: '/markers/:atlasId/:markerId',
        handler: updateMarker,
        schema: {
          body: UPDATE_MARKER_REQUEST_BODY_SCHEMA,
          params: UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  }
}
