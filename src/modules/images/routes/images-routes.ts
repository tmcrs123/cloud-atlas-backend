import { Routes } from "../../../shared/types/index.js";
import {
  deleteImageFromMarker,
  getImagesForMap,
  getImagesForMarker,
  getPresignedURL,
  saveImageDetails,
} from "../controllers/index.js";

export const getImagesRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "GET",
        url: "/images/:mapId/:markerId/markers",
        handler: getImagesForMarker,
      },
      {
        method: "GET",
        url: "/images/:mapId/maps",
        handler: getImagesForMap,
      },
      {
        method: "GET",
        url: "/images/:mapId/:markerId",
        handler: getPresignedURL,
      },
      {
        method: "DELETE",
        url: "/images/:mapId/:markerId/:imageId",
        handler: deleteImageFromMarker,
      },
      {
        method: "POST",
        url: "/images/:mapId/:markerId",
        handler: saveImageDetails,
      },
    ],
  };
};
