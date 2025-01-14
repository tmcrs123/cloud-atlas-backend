import z from "zod";

export const SNAPPIN_MARKER_SCHEMA = z.object({
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

export type SnappinMarker = z.infer<typeof SNAPPIN_MARKER_SCHEMA>;

export const CREATE_SNAPPIN_MARKER_REQUEST_BODY_SCHEMA = z
  .object({
    mapId: z.string(),
    coordinates: z.object({
      lng: z.number(),
      lat: z.number(),
    }),
  })
  .strict();
export type CreateSnappinMarkerRequestBody = z.infer<
  typeof CREATE_SNAPPIN_MARKER_REQUEST_BODY_SCHEMA
>;

export const CREATE_SNAPPIN_MARKER_DTO_SCHEMA = z
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
export type CreateSnappinMarkerDTO = z.infer<
  typeof CREATE_SNAPPIN_MARKER_DTO_SCHEMA
>;

export const UPDATE_SNAPPIN_MARKER_REQUEST_BODY_SCHEMA = z
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
    mapId: z.string(),
  })
  .strict();
export type UpdateSnappinMarkerRequestBody = z.infer<
  typeof UPDATE_SNAPPIN_MARKER_REQUEST_BODY_SCHEMA
>;

export const UPDATE_SNAPPIN_MARKER_DTO_SCHEMA = z
  .object({
    id: z.string(),
    mapId: z.string(),
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
export type UpdateMarkerDTO = z.infer<typeof UPDATE_SNAPPIN_MARKER_DTO_SCHEMA>;

export const GET_SNAPPIN_MARKER_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export const DELETE_SNAPPIN_MARKER_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();
