import z from "zod";

const CLAIMS = ["OWN", "VIEW", "EDIT"] as const;

export const MAP_SCHEMA = z.object({
  id: z.string().uuid(),
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string(),
  updatedAt: z.optional(z.string()),
  markersCount: z.number().int(),
  title: z.string(),
  claims: z.array(z.enum(CLAIMS)),
});

export const CREATE_MAP_REQUEST_BODY_SCHEMA = z
  .object({
    title: z.string(),
  })
  .strict();

export type CreateMapRequestBody = z.infer<
  typeof CREATE_MAP_REQUEST_BODY_SCHEMA
>;

export const CREATE_MAP_DTO_SCHEMA = z.object({
  id: z.string().uuid(),
  owner: z.string().uuid(),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string(),
  markersCount: z.number().int(),
  title: z.string(),
  claims: z.array(z.enum(CLAIMS)),
});

export type CreateMapDTO = z.infer<typeof CREATE_MAP_DTO_SCHEMA>;

export const GET_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export type GetMapRequestParams = z.infer<typeof GET_MAP_REQUEST_PARAMS_SCHEMA>;

export const DELETE_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export type DeleteMapRequestParams = z.infer<
  typeof DELETE_MAP_REQUEST_PARAMS_SCHEMA
>;

export const UPDATE_MAP_DTO_SCHEMA = z.object({
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  updatedAt: z.string(),
  title: z.optional(z.string()),
  claims: z.optional(z.array(z.enum(CLAIMS))),
});

export type UpdateMapDTO = z.infer<typeof UPDATE_MAP_DTO_SCHEMA>;

export const UPDATE_MAP_REQUEST_BODY_SCHEMA = z
  .object({
    title: z.string(),
    coverPhoto: z.optional(z.string()),
  })
  .strict();

export type UpdateMapRequestBody = z.infer<
  typeof UPDATE_MAP_REQUEST_BODY_SCHEMA
>;

export type UpdateMapRequestParams = z.infer<
  typeof UPDATE_MAP_REQUEST_PARAMS_SCHEMA
>;

export const UPDATE_MAP_REQUEST_PARAMS_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

// Models
export type Map = z.infer<typeof MAP_SCHEMA>;
