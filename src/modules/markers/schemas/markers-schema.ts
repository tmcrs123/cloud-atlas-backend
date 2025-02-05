import z from 'zod'

export const MARKER_SCHEMA = z.object({
  markerId: z.string().uuid(),
  atlasId: z.string().uuid(),
  startDate: z.optional(z.string().length(29)),
  endDate: z.optional(z.string().length(29)),
  createdAt: z.string().length(29),
  updatedAt: z.optional(z.string().length(29)),
  imageCount: z.number().int().gte(0),
  title: z.optional(z.string().min(3)),
  journal: z.optional(z.string()),
  coordinates: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
})
export type Marker = z.infer<typeof MARKER_SCHEMA>

export const CREATE_MARKERS_REQUEST_BODY_SCHEMA = z
  .object({
    markers: z.array(
      z.object({
        coordinates: z.object({
          lng: z.number(),
          lat: z.number(),
        }),
        title: z.string().min(3),
      }),
    ),
  })
  .strict()
export type CreateMarkersRequestBody = z.infer<typeof CREATE_MARKERS_REQUEST_BODY_SCHEMA>

export const CREATE_MARKERS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
  })
  .strict()
export type CreateMarkersRequestParams = z.infer<typeof CREATE_MARKERS_REQUEST_PARAMS_SCHEMA>

export const CREATE_MARKER_DTO_SCHEMA = z
  .object({
    markerId: z.string().uuid(),
    atlasId: z.string().uuid(),
    createdAt: z.string().length(29),
    coordinates: z.object({
      lng: z.number(),
      lat: z.number(),
    }),
    imageCount: z.number().int().gte(0),
  })
  .strict()

export type CreateMarkerDTO = z.infer<typeof CREATE_MARKER_DTO_SCHEMA>

export const UPDATE_MARKER_REQUEST_BODY_SCHEMA = z
  .object({
    coordinates: z.optional(
      z.object({
        lng: z.number(),
        lat: z.number(),
      }),
    ),
    title: z.optional(z.string()),
    startDate: z.optional(z.string().length(29)),
    endDate: z.optional(z.string().length(29)),
    journal: z.optional(z.string()),
  })
  .strict()

export const UPDATE_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
    markerId: z.string().uuid(),
  })
  .strict()

export type UpdateMarkerRequestBody = z.infer<typeof UPDATE_MARKER_REQUEST_BODY_SCHEMA>

export type UpdateMarkerRequestParams = z.infer<typeof UPDATE_MARKER_REQUEST_PARAMS_SCHEMA>

export const UPDATE_MARKER_DTO_SCHEMA = z
  .object({
    coordinates: z.optional(
      z.object({
        lng: z.number(),
        lat: z.number(),
      }),
    ),
    title: z.optional(z.string()),
    startDate: z.optional(z.string().length(29)),
    endDate: z.optional(z.string().length(29)),
    journal: z.optional(z.string().length(29)),
    updatedAt: z.string(),
  })
  .strict()

export type UpdateMarkerDTO = z.infer<typeof UPDATE_MARKER_DTO_SCHEMA>

export const GET_MARKER_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
    markerId: z.string().uuid(),
  })
  .strict()
export type GetMarkerRequestParams = z.infer<typeof GET_MARKER_REQUEST_PARAMS_SCHEMA>

export const GET_MARKERS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
  })
  .strict()
export type GetMarkersRequestParams = z.infer<typeof GET_MARKERS_REQUEST_PARAMS_SCHEMA>

export const DELETE_MARKERS_REQUEST_BODY_SCHEMA = z
  .object({
    markerIds: z.array(z.string().uuid()),
  })
  .strict()

export const DELETE_MARKERS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
  })
  .strict()

export type DeleteMarkersRequestParams = z.infer<typeof DELETE_MARKERS_REQUEST_PARAMS_SCHEMA>

export type DeleteMarkersRequestBody = z.infer<typeof DELETE_MARKERS_REQUEST_BODY_SCHEMA>

export const DELETE_MARKERS_QUERYSTRING_SCHEMA = z.object({
  all: z.enum(['0', '1']).transform((val) => val === '1'),
})

export type DeleteMarkersRequestQueryString = z.infer<typeof DELETE_MARKERS_QUERYSTRING_SCHEMA>
