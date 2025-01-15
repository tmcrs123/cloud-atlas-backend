import { Routes } from "../../../shared/types/index.js";
import {
  createMap,
  deleteMap,
  getMap,
  updateMap,
} from "../controllers/index.js";
import {
  CREATE_MAP_REQUEST_BODY_SCHEMA,
  DELETE_MAP_REQUEST_PARAMS_SCHEMA,
  GET_MAP_REQUEST_PARAMS_SCHEMA,
  MAP_SCHEMA,
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
        url: "/maps/:id",
        handler: getMap,
        schema: {
          params: GET_MAP_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "DELETE",
        url: "/maps/:id",
        handler: deleteMap,
        schema: {
          params: DELETE_MAP_REQUEST_PARAMS_SCHEMA,
        },
      },
      {
        method: "PUT",
        url: "/maps/:id",
        handler: updateMap,
        schema: {
          body: UPDATE_MAP_REQUEST_BODY_SCHEMA,
          params: UPDATE_MAP_REQUEST_PARAMS_SCHEMA,
        },
      },
    ],
  };
};
