import z from 'zod'

export const CREATE_MAP_SCHEMA = z.object({
//   id: z.string(),
//   coverPhoto: z.optional(z.string()),
//   createdAt: z.string(),
//   markersCount: z.number().int(),
  title: z.string(),
  
})

export type CREATE_MAP_SCHEMA_TYPE = z.infer<typeof CREATE_MAP_SCHEMA>
