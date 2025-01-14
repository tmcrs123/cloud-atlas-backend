import z from "zod";

const CLAIMS = ["OWN", "VIEW", "EDIT"] as const;

export const SNAPPIN_MAP_SCHEMA = z.object({
  id: z.string().uuid(),
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string(),
  markersCount: z.number().int(),
  title: z.string(),
  claims: z.array(z.enum(CLAIMS)),
});

export const CREATE_SNAPPIN_MAP_BODY_SCHEMA = z
  .object({
    title: z.string(),
  })
  .strict();

export const GET_SNAPPIN_MAP_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export const DELETE_SNAPPIN_MAP_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

export const UPDATE_SNAPPIN_MAP_BODY_SCHEMA = z
  .object({
    title: z.string(),
    coverPhoto: z.optional(z.string()),
  })
  .strict();

export const UPDATE_SNAPPIN_MAP_PARAMS_SCHEMA = z
  .object({
    id: z.string(),
  })
  .strict();

// Zod validation types
export type CREATE_SNAPPIN_MAP_SCHEMA_TYPE = z.infer<
  typeof CREATE_SNAPPIN_MAP_BODY_SCHEMA
>;

export type GET_SNAPPIN_MAP_SCHEMA_TYPE = z.infer<
  typeof GET_SNAPPIN_MAP_SCHEMA
>;

export type DELETE_SNAPPIN_MAP_SCHEMA_TYPE = z.infer<
  typeof DELETE_SNAPPIN_MAP_SCHEMA
>;

export type UPDATE_SNAPPIN_MAP_BODY_SCHEMA_TYPE = z.infer<
  typeof UPDATE_SNAPPIN_MAP_BODY_SCHEMA
>;

export type UPDATE_SNAPPIN_MAP_PARAMS_SCHEMA_TYPE = z.infer<
  typeof UPDATE_SNAPPIN_MAP_PARAMS_SCHEMA
>;

// Models
export type SnappinMap = z.infer<typeof SNAPPIN_MAP_SCHEMA>;
export type CreateMapDTO = CREATE_SNAPPIN_MAP_SCHEMA_TYPE & { owner: string };
export type UpdateMapDTO = UPDATE_SNAPPIN_MAP_BODY_SCHEMA_TYPE;
