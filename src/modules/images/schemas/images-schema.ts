import z from "zod";

export const IMAGE_SCHEMA = z.object({
  url: z.string(),
});
export type Marker = z.infer<typeof IMAGE_SCHEMA>;
