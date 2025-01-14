import { Routes } from "../../../shared/types/index.js";
import {
  createManyMarkers,
  createMarker,
  deleteMarker,
  getMarker,
  updateMarker,
} from "../controllers/index.js";

export const getMarkersRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "POST",
        url: "/marker",
        handler: createMarker,
      },
      {
        method: "POST",
        url: "/markers",
        handler: createManyMarkers,
      },
      {
        method: "GET",
        url: "/markers/:id",
        handler: getMarker,
      },
      {
        method: "DELETE",
        url: "/markers/:id",
        handler: deleteMarker,
      },
      {
        method: "PUT",
        url: "/markers/:id/update",
        handler: updateMarker,
      },
    ],
  };
};
