import { Routes } from "../../../shared/types/index.js";
import {
  createMarkers,
  deleteMarkers,
  deleteMarker,
  getMarker,
  getMarkers,
  updateMarker,
} from "../controllers/index.js";
import {
  CREATE_MARKERS_REQUEST_BODY_SCHEMA,
  CREATE_MARKERS_REQUEST_PARAMS_SCHEMA,
  DELETE_MARKERS_QUERYSTRING_SCHEMA,
  DELETE_MARKERS_REQUEST_BODY_SCHEMA,
  DELETE_MARKERS_REQUEST_PARAMS_SCHEMA,
  DELETE_MARKER_REQUEST_PARAMS_SCHEMA,
  GET_MARKERS_REQUEST_PARAMS_SCHEMA,
  GET_MARKER_REQUEST_PARAMS_SCHEMA,
  UPDATE_MARKER_REQUEST_BODY_SCHEMA,
  UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
} from "../schemas/markers-schema.js";

export const getMarkersRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/markers/:mapId",
        handler: createMarkers,
        schema: {
          body: CREATE_MARKERS_REQUEST_BODY_SCHEMA,
          params: CREATE_MARKERS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/markers/:mapId",
        handler: getMarkers,
        schema: {
          params: GET_MARKERS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/markers/:mapId/:markerId",
        handler: getMarker,
        schema: {
          params: GET_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "DELETE",
        url: "/marker/:mapId/:markerId",
        handler: deleteMarker,
        schema: {
          params: DELETE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "DELETE",
        url: "/markers/:mapId",
        handler: deleteMarkers,
        schema: {
          params: DELETE_MARKERS_REQUEST_PARAMS_SCHEMA,
          body: DELETE_MARKERS_REQUEST_BODY_SCHEMA,
          querystring: DELETE_MARKERS_QUERYSTRING_SCHEMA,
        },
      },
      {
        method: "PUT",
        url: "/markers/:mapId/:markerId",
        handler: updateMarker,
        schema: {
          body: UPDATE_MARKER_REQUEST_BODY_SCHEMA,
          params: UPDATE_MARKER_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  };
};
