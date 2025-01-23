import { Routes } from "../../../shared/types/index.js";
import {
  deleteImageFromMarker,
  getImagesForMap,
  getImagesForMarker,
  uploadImage,
  updateImage,
} from "../controllers/index.js";
import {
  DELETE_IMAGE_FROM_MARKER_SCHEMA,
  GET_IMAGES_FOR_MAP_SCHEMA,
  GET_IMAGES_FOR_MARKER_SCHEMA,
  GET_PRESIGNED_URL_SCHEMA,
  UPDATE_IMAGE_REQUEST_BODY_SCHEMA,
  UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA,
} from "../schemas/index.js";

export const getImagesRoutes = (): { routes: Routes } => {
  return {
    routes: [
      {
        method: "GET",
        url: "/images/:mapId/:markerId/markers",
        handler: getImagesForMarker,
        schema: {
          params: GET_IMAGES_FOR_MARKER_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/images/:mapId/maps",
        handler: getImagesForMap,
        schema: {
          params: GET_IMAGES_FOR_MAP_SCHEMA,
        },
      },
      {
        method: "GET",
        url: "/images/:mapId/:markerId",
        handler: uploadImage,
        schema: {
          params: GET_PRESIGNED_URL_SCHEMA,
        },
      },
      {
        method: "DELETE",
        url: "/images/:mapId/:markerId/:imageId",
        handler: deleteImageFromMarker,
        schema: {
          params: DELETE_IMAGE_FROM_MARKER_SCHEMA,
        },
      },
      {
        method: "POST",
        url: "/images/:mapId/:imageId",
        handler: updateImage,
        schema: {
          params: UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA,
          body: UPDATE_IMAGE_REQUEST_BODY_SCHEMA,
        },
      },
    ],
  };
};
