import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().trim().max(80, "Use 80 characters or fewer."),
  email: z.string().trim().email("Enter a valid email address."),
});

export type ProfileValues = z.infer<typeof profileSchema>;
