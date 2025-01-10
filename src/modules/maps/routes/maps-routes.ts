import { Routes } from "../../../shared/common-types";
import { createMap, getMap } from "../controllers/maps-controller";
import { CREATE_MAP_SCHEMA } from "../schemas";

export const getMapsRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/maps",
        handler: createMap,
        schema: {
          body: CREATE_MAP_SCHEMA,
          response: {
            200: CREATE_MAP_SCHEMA,
            400: CREATE_MAP_SCHEMA,
          },
          description: "Create a new user bananas apples",
          summary: "User creation endpoint",
          tags: ["User"],
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
