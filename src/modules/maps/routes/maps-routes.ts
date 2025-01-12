import { Routes } from "../../../shared/types/common-types";
import { createMap, getMap } from "../controllers/maps-controller";
import { CREATE_SNAPPIN_MAP_SCHEMA, SNAPPIN_MAP_SCHEMA } from "../schemas";

export const getMapsRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "PUT",
        url: "/maps",
        handler: createMap,
        schema: {
          body: CREATE_SNAPPIN_MAP_SCHEMA,
          response: {
            201: SNAPPIN_MAP_SCHEMA,
          },
          description: "Create a new map for the current user",
          summary: "Map creation endpoint",
          tags: ["Map"],
        },
      },
      {
        method: "GET",
        url: "/maps",
        handler: getMap,
      },
    ],
  };
};
