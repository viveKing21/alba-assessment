import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required.").max(120),
  description: z.string().trim().max(1000),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid project color."),
});

export type ProjectValues = z.infer<typeof projectSchema>;
