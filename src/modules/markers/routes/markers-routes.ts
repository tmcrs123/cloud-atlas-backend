import { Routes } from "../../../shared/types/index.js";
import {
  createManyMarkers,
  createMarker,
  deleteMarker,
  getMarker,
  getMarkersForMap,
  updateMarker,
} from "../controllers/index.js";
import {
  CREATE_MANY_MARKER_REQUEST_BODY_SCHEMA,
  CREATE_MANY_MARKER_REQUEST_PARAMS_SCHEMA,
  CREATE_MARKER_REQUEST_BODY_SCHEMA,
  CREATE_MARKER_REQUEST_PARAMS_SCHEMA,
  DELETE_MARKER_REQUEST_PARAMS_SCHEMA,
  GET_MANY_MARKER_REQUEST_PARAMS_SCHEMA,
  GET_MARKER_REQUEST_PARAMS_SCHEMA,
  UPDATE_MARKER_REQUEST_BODY_SCHEMA,
  UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
} from "../schemas/markers-schema.js";

export const getMarkersRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/marker",
        handler: createMarker,
        schema: {
          body: CREATE_MARKER_REQUEST_BODY_SCHEMA,
          params: CREATE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "POST",
        url: "/markers/:mapId",
        handler: createManyMarkers,
        schema: {
          body: CREATE_MANY_MARKER_REQUEST_BODY_SCHEMA,
          params: CREATE_MANY_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/markers/:mapId",
        handler: getMarkersForMap,
        schema: {
          params: GET_MANY_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/markerss/:id",
        handler: getMarker,
        schema: {
          params: GET_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "DELETE",
        url: "/markers/:mapId/:id",
        handler: deleteMarker,
        schema: {
          params: DELETE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "PUT",
        url: "/markers/:mapId/:id",
        handler: updateMarker,
        schema: {
          body: UPDATE_MARKER_REQUEST_BODY_SCHEMA,
          params: UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  };
};
