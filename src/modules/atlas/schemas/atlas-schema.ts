import z from 'zod'

const CLAIMS = ['OWN', 'VIEW', 'EDIT'] as const

export const ATLAS_SCHEMA = z.object({
  atlasId: z.string().uuid(),
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string().length(29),
  updatedAt: z.optional(z.string().length(29)),
  markersCount: z.number().int().gte(0),
  title: z.string().min(3),
  claims: z.array(z.enum(CLAIMS)),
})

export const ATLAS_OWNERSHIP_SCHEMA = z.object({
  userId: z.string().uuid(),
  atlasId: z.string().uuid(),
})

export type Atlas = z.infer<typeof ATLAS_SCHEMA>
export type AtlasOwnership = z.infer<typeof ATLAS_OWNERSHIP_SCHEMA>

export const CREATE_ATLAS_REQUEST_BODY_SCHEMA = z
  .object({
    title: z.string().min(3),
  })
  .strict()

export type CreateAtlasRequestBody = z.infer<typeof CREATE_ATLAS_REQUEST_BODY_SCHEMA>

export const CREATE_ATLAS_DTO_SCHEMA = z.object({
  atlasId: z.string().uuid(),
  owner: z.string().uuid(),
  coverPhoto: z.optional(z.string()),
  createdAt: z.string().length(29),
  markersCount: z.number().int().gte(0),
  title: z.string().min(3),
  claims: z.array(z.enum(CLAIMS)),
})

export type CreateAtlasDTO = z.infer<typeof CREATE_ATLAS_DTO_SCHEMA>

export const GET_ATLAS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasIds: z.string(),
  })
  .strict()

export type GetAtlasRequestParams = z.infer<typeof GET_ATLAS_REQUEST_PARAMS_SCHEMA>

export const DELETE_ATLAS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
  })
  .strict()

export type DeleteAtlasRequestParams = z.infer<typeof DELETE_ATLAS_REQUEST_PARAMS_SCHEMA>

export const UPDATE_ATLAS_DTO_SCHEMA = z.object({
  owner: z.optional(z.string().uuid()),
  coverPhoto: z.optional(z.string()),
  updatedAt: z.string().length(29),
  title: z.optional(z.string().min(3)),
  claims: z.optional(z.array(z.enum(CLAIMS))),
})

export type UpdateAtlasDTO = z.infer<typeof UPDATE_ATLAS_DTO_SCHEMA>

export const UPDATE_ATLAS_REQUEST_BODY_SCHEMA = z.object({
  title: z.string().min(3),
  coverPhoto: z.optional(z.string()),
})

export type UpdateAtlasRequestBody = z.infer<typeof UPDATE_ATLAS_REQUEST_BODY_SCHEMA>

export const UPDATE_ATLAS_REQUEST_PARAMS_SCHEMA = z
  .object({
    atlasId: z.string().uuid(),
  })
  .strict()

export type UpdateAtlasRequestParams = z.infer<typeof UPDATE_ATLAS_REQUEST_PARAMS_SCHEMA>
