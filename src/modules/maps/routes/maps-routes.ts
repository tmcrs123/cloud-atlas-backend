import { Routes } from "../../../shared/types/index.js";
import {
  createMap,
  deleteMap,
  getMapsForUser as getMapsDetails,
  getMapsForUser,
  updateMap,
} from "../controllers/index.js";
import {
  CREATE_MAP_REQUEST_BODY_SCHEMA,
  DELETE_MAP_REQUEST_PARAMS_SCHEMA,
  GET_MAPS_REQUEST_PARAMS_SCHEMA,
  UPDATE_MAP_REQUEST_BODY_SCHEMA,
  UPDATE_MAP_REQUEST_PARAMS_SCHEMA,
} from "../schemas/index.js";

export const getMapsRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/maps",
        handler: createMap,
        schema: {
          body: CREATE_MAP_REQUEST_BODY_SCHEMA,
          description: "Create a new map for the current user",
          summary: "Map creation endpoint",
          tags: ["Map"],
        },
      },
      {
        method: "GET",
        url: "/maps/:mapIds",
        handler: getMapsDetails,
        schema: {
          params: GET_MAPS_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/maps",
        handler: getMapsForUser,
      },
      {
        method: "DELETE",
        url: "/maps/:mapId",
        handler: deleteMap,
        schema: {
          params: DELETE_MAP_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "PUT",
        url: "/maps/:mapId",
        handler: updateMap,
        schema: {
          body: UPDATE_MAP_REQUEST_BODY_SCHEMA,
          params: UPDATE_MAP_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  };
};
