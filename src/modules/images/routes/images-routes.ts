import { Routes } from "../../../shared/types/index.js";
import { getImagesForMarker, getPresignedURL } from "../controllers/index.js";

export const getImagesRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "GET",
        url: "/images/:mapId",
        handler: getImagesForMarker,
      },
      {
        method: "GET",
        url: "/images/:mapId/:markerId",
        handler: getPresignedURL,
      },
    ],
  };
};
