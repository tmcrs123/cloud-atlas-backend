import z from "zod";

const CLAIMS = ["OWN", "VIEW", "EDIT"] as const;

export const SNAPPIN_MAP_SCHEMA = z.object({
  id: z.string().uuid(),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string(),
  markersCount: z.number().int(),
  title: z.string(),
  claims: z.array(z.enum(CLAIMS)),
});

export const CREATE_SNAPPIN_MAP_SCHEMA = z.object({
  title: z.string(),
});

// Zod validation types
export type CREATE_SNAPPIN_SCHEMA_TYPE = z.infer<
  typeof CREATE_SNAPPIN_MAP_SCHEMA
>;

// Models
export type SnappinMap = z.infer<typeof SNAPPIN_MAP_SCHEMA>;
export type CreateMapDTO = CREATE_SNAPPIN_SCHEMA_TYPE & { ownerId: string };
