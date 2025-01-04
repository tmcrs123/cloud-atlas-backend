import { Routes } from "../../../shared/common-types";
import { createMap } from "../controllers/maps-controller";
import { CREATE_MAP_SCHEMA } from "../schemas";

export const getMapsRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/maps",
        handler: createMap,
        schema: { body: CREATE_MAP_SCHEMA },
      },
    ],
  };
};
