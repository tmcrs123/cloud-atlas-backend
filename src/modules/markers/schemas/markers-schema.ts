import z from "zod";

const LatLngSchema = z
  .object({
    lng: z.number(),
    lat: z.number(),
  })
  .strict();

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

export const CREATE_SNAPPIN_MARKER_BODY_SCHEMA =
  CREATE_SNAPPIN_MARKER_DTO_SCHEMA;

export const CREATE_SNAPPIN_MARKERS_BODY_SCHEMA = z.array(
  CREATE_SNAPPIN_MARKER_DTO_SCHEMA
);

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
