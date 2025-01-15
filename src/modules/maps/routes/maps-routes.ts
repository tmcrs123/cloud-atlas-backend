import { Routes } from "../../../shared/types/index.js";
import {
  createMap,
  deleteMap,
  getMap,
  updateMap,
} from "../controllers/index.js";
import {
  CREATE_MAP_REQUEST_BODY_SCHEMA,
  MAP_SCHEMA,
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
          response: {
            201: MAP_SCHEMA,
          },
          description: "Create a new map for the current user",
          summary: "Map creation endpoint",
          tags: ["Map"],
        },
      },
      {
        method: "GET",
        url: "/maps/:id",
        handler: getMap,
      },
      {
        method: "DELETE",
        url: "/maps/:id",
        handler: deleteMap,
      },
      {
        method: "PUT",
        url: "/maps/:id",
        handler: updateMap,
      },
    ],
  };
};
