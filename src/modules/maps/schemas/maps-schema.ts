import z from "zod";

export const MAP_SCHEMA = z.object({
  id: z.string(),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string(),
  markersCount: z.number().int(),
  title: z.string(),
});

export const CREATE_MAP_SCHEMA = z.object({
  title: z.string(),
});

// Zod validation types
export type CREATE_MAP_SCHEMA_TYPE = z.infer<typeof CREATE_MAP_SCHEMA>;

// Models
export type Map = z.infer<typeof MAP_SCHEMA>;
export type CreateMapDTO = CREATE_MAP_SCHEMA_TYPE;
