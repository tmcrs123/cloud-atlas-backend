import z from "zod";

export const MARKER_SCHEMA = z.object({
  markerId: z.string().uuid(),
  mapId: z.string().uuid(),
  startDate: z.optional(z.string().length(29)),
  endDate: z.optional(z.string().length(29)),
  createdAt: z.string().length(29),
  updateAt: z.optional(z.string().length(29)),
  imageCount: z.number().int().gte(0),
  title: z.string().min(3),
  journal: z.optional(z.string()),
  coordinates: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
});
export type Marker = z.infer<typeof MARKER_SCHEMA>;

export const CREATE_MANY_MARKER_REQUEST_BODY_SCHEMA = z.array(
  z
    .object({
      coordinates: z.object({
        lng: z.number(),
        lat: z.number(),
      }),
    })
    .strict()
);

export const CREATE_MANY_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();

export type CreateManyMarkerRequestBody = z.infer<
  typeof CREATE_MANY_MARKER_REQUEST_BODY_SCHEMA
>;

export type CreateManyMarkerRequestParams = z.infer<
  typeof CREATE_MANY_MARKER_REQUEST_PARAMS_SCHEMA
>;

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
    mapId: z.string().uuid(),
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
    markerId: z.string().uuid(),
    mapId: z.string().uuid(),
    createdAt: z.string().length(29),
    coordinates: z.object({
      lng: z.number(),
      lat: z.number(),
    }),
    imageCount: z.number().int().gte(0),
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
    startDate: z.optional(z.string().length(29)),
    endDate: z.optional(z.string().length(29)),
    journal: z.optional(z.string()),
  })
  .strict();

export const UPDATE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
    markerId: z.string().uuid(),
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
    coordinates: z.optional(
      z.object({
        lng: z.number(),
        lat: z.number(),
      })
    ),
    title: z.optional(z.string()),
    startDate: z.optional(z.string().length(29)),
    endDate: z.optional(z.string().length(29)),
    journal: z.optional(z.string().length(29)),
    updatedAt: z.string(),
  })
  .strict();

export type UpdateMarkerDTO = z.infer<typeof UPDATE_MARKER_DTO_SCHEMA>;

export const GET_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    markerId: z.string().uuid(),
  })
  .strict();
export type GetMarkerRequestParams = z.infer<
  typeof GET_MARKER_REQUEST_PARAMS_SCHEMA
>;

export const GET_MANY_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();
export type GetManyMarkerRequestParams = z.infer<
  typeof GET_MANY_MARKER_REQUEST_PARAMS_SCHEMA
>;

export const DELETE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    markerId: z.string().uuid(),
    mapId: z.string().uuid(),
  })
  .strict();

export type DeleteMarkerRequestParams = z.infer<
  typeof DELETE_MARKER_REQUEST_PARAMS_SCHEMA
>;

export const DELETE_MANY_MARKERS_REQUEST_BODY_SCHEMA = z
  .object({
    markerIds: z.array(z.string().uuid()),
  })
  .strict();

export const DELETE_MANY_MARKERS_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();

export type DeleteManyMarkersRequestParams = z.infer<
  typeof DELETE_MANY_MARKERS_REQUEST_PARAMS_SCHEMA
>;

export type DeleteManyMarkersRequestBody = z.infer<
  typeof DELETE_MANY_MARKERS_REQUEST_BODY_SCHEMA
>;
