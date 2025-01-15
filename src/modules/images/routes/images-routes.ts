import { Routes } from "../../../shared/types/index.js";
import { getImagesForMarker } from "../controllers/index.js";

export const getImagesRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "GET",
        url: "/markers/:mapId",
        handler: getImagesForMarker,
      },
    ],
  };
};
