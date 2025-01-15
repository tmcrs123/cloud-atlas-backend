import z from "zod";

export const MARKER_SCHEMA = z.object({
  id: z.string().uuid(),
  mapId: z.string().uuid(),
  startDate: z.optional(z.string()),
  endDate: z.optional(z.string()),
  createdAt: z.string(),
  updateAt: z.optional(z.string()),
  imageCount: z.number().int(),
  title: z.string(),
  journal: z.optional(z.string()),
  coordinates: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
});
export type Marker = z.infer<typeof MARKER_SCHEMA>;

export const CREATE_MARKER_REQUEST_BODY_SCHEMA = z
  .object({
    coordinates: z.object({
      lng: z.number(),
      lat: z.number(),
    }),
  })
  .strict();

export const CREATE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string(),
  })
  .strict();

export type CreateMarkerRequestBody = z.infer<
  typeof CREATE_MARKER_REQUEST_BODY_SCHEMA
>;

export type CreateMarkerRequestParams = z.infer<
  typeof CREATE_MARKER_REQUEST_PARAMS_SCHEMA
>;

export const CREATE_MARKER_DTO_SCHEMA = z
  .object({
    id: z.string(),
    mapId: z.string(),
    createdAt: z.string(),
    coordinates: z.object({
      lng: z.number(),
      lat: z.number(),
    }),
    imageCount: z.number().int(),
  })
  .strict();

export type CreateMarkerDTO = z.infer<typeof CREATE_MARKER_DTO_SCHEMA>;

export const UPDATE_MARKER_REQUEST_BODY_SCHEMA = z
  .object({
    coordinates: z.optional(
      z.object({
        lng: z.number(),
        lat: z.number(),
      })
    ),
    title: z.optional(z.string()),
    startDate: z.optional(z.string()),
    endDate: z.optional(z.string()),
    journal: z.optional(z.string()),
    id: z.string(),
  })
  .strict();

export const UPDATE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string(),
    id: z.string(),
  })
  .strict();

export type UpdateMarkerRequestBody = z.infer<
  typeof UPDATE_MARKER_REQUEST_BODY_SCHEMA
>;

export type UpdateMarkerRequestParams = z.infer<
  typeof UPDATE_MARKER_REQUEST_PARAMS_SCHEMA
>;

export const UPDATE_MARKER_DTO_SCHEMA = z
  .object({
    id: z.string(),
    coordinates: z.optional(
      z.object({
        lng: z.number(),
        lat: z.number(),
      })
    ),
    title: z.optional(z.string()),
    startDate: z.optional(z.string()),
    endDate: z.optional(z.string()),
    journal: z.optional(z.string()),
    updatedAt: z.string(),
  })
  .strict();

export type UpdateMarkerDTO = z.infer<typeof UPDATE_MARKER_DTO_SCHEMA>;

export const GET_MARKER_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();
export type GetMarkerRequestParams = z.infer<typeof GET_MARKER_SCHEMA>;

export const DELETE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export type DeleteMarkerRequestParams = z.infer<
  typeof DELETE_MARKER_REQUEST_PARAMS_SCHEMA
>;
