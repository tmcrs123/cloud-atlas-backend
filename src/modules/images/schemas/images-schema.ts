import z from "zod";

export const IMAGE_SCHEMA = z.object({
  url: z.optional(z.string()),
  legend: z.optional(z.string()),
  mapId: z.string().uuid(),
  markerId: z.string().uuid(),
  imageId: z.string().uuid(),
});
export type Image = z.infer<typeof IMAGE_SCHEMA>;

export const GET_IMAGES_FOR_MARKER_SCHEMA = z.object({
  mapId: z.string().uuid(),
  markerId: z.string().uuid(),
});
export type GetImagesForMarkerRequestParams = z.infer<
  typeof GET_IMAGES_FOR_MARKER_SCHEMA
>;

export const GET_IMAGES_FOR_MAP_SCHEMA = z.object({
  mapId: z.string().uuid(),
});
export type GetImagesForMapRequestParams = z.infer<
  typeof GET_IMAGES_FOR_MAP_SCHEMA
>;

export const GET_PRESIGNED_URL_SCHEMA = z.object({
  mapId: z.string().uuid(),
  markerId: z.string().uuid(),
});
export type GetPresignedUrlRequestParams = z.infer<
  typeof GET_PRESIGNED_URL_SCHEMA
>;

export const DELETE_IMAGE_FROM_MARKER_SCHEMA = z.object({
  mapId: z.string().uuid(),
  markerId: z.string().uuid(),
  imageId: z.string().uuid(),
});
export type DeleteImageFromMarkerRequestParams = z.infer<
  typeof DELETE_IMAGE_FROM_MARKER_SCHEMA
>;

export const UPDATE_IMAGE_REQUEST_BODY_SCHEMA = z.object({
  legend: z.string(),
});
export type UpdateImageDetailsRequestBody = z.infer<
  typeof UPDATE_IMAGE_REQUEST_BODY_SCHEMA
>;

export const UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA = z.object({
  mapId: z.string().uuid(),
  imageId: z.string().uuid(),
});
export type UpdateImageDetailsRequestParams = z.infer<
  typeof UPDATE_IMAGE_REQUEST_PARAMS_SCHEMA
>;

// DTOs
export type UpdateImageDTO = z.infer<typeof UPDATE_IMAGE_REQUEST_BODY_SCHEMA>;

export const CREATE_IMAGE_DTO_SCHEMA = z.object({
  mapId: z.string().uuid(),
  markerId: z.string().uuid(),
  imageId: z.string(),
});
export type CreateImageDTO = z.infer<typeof CREATE_IMAGE_DTO_SCHEMA>;
