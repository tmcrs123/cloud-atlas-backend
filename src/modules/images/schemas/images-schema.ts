import z from "zod";

export const IMAGE_SCHEMA = z.object({
  url: z.optional(z.string()),
  imageId: z.string().uuid(),
});
export type Image = z.infer<typeof IMAGE_SCHEMA>;
