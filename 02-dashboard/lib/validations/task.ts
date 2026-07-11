import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Task title is required.").max(160),
  description: z.string().trim().max(2000),
  status: z.enum(["todo", "in_progress", "completed"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().date("Choose a valid date.").nullable(),
});

export type TaskValues = z.infer<typeof taskSchema>;
