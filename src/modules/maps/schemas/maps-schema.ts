import z from "zod";

const CLAIMS = ["OWN", "VIEW", "EDIT"] as const;

export const MAP_SCHEMA = z.object({
  mapId: z.string().uuid(),
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string().length(29),
  updatedAt: z.optional(z.string().length(29)),
  markersCount: z.number().int().gte(0),
  title: z.string().min(3),
  claims: z.array(z.enum(CLAIMS)),
});

export type Map = z.infer<typeof MAP_SCHEMA>;

export const CREATE_MAP_REQUEST_BODY_SCHEMA = z
  .object({
    title: z.string().min(3),
  })
  .strict();

export type CreateMapRequestBody = z.infer<
  typeof CREATE_MAP_REQUEST_BODY_SCHEMA
>;

export const CREATE_MAP_DTO_SCHEMA = z.object({
  mapId: z.string().uuid(),
  owner: z.string().uuid(),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string().length(29),
  markersCount: z.number().int().gte(0),
  title: z.string().min(3),
  claims: z.array(z.enum(CLAIMS)),
});

export type CreateMapDTO = z.infer<typeof CREATE_MAP_DTO_SCHEMA>;

export const GET_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();

export type GetMapRequestParams = z.infer<typeof GET_MAP_REQUEST_PARAMS_SCHEMA>;

export const DELETE_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();

export type DeleteMapRequestParams = z.infer<
  typeof DELETE_MAP_REQUEST_PARAMS_SCHEMA
>;

export const UPDATE_MAP_DTO_SCHEMA = z.object({
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  updatedAt: z.string().length(29),
  title: z.optional(z.string().min(3)),
  claims: z.optional(z.array(z.enum(CLAIMS))),
});

export type UpdateMapDTO = z.infer<typeof UPDATE_MAP_DTO_SCHEMA>;

export const UPDATE_MAP_REQUEST_BODY_SCHEMA = z
  .object({
    title: z.string().min(3),
    coverPhoto: z.optional(z.string()),
  })
  .strict();

export type UpdateMapRequestBody = z.infer<
  typeof UPDATE_MAP_REQUEST_BODY_SCHEMA
>;

export const UPDATE_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    mapId: z.string().uuid(),
  })
  .strict();

export type UpdateMapRequestParams = z.infer<
  typeof UPDATE_MAP_REQUEST_PARAMS_SCHEMA
>;
