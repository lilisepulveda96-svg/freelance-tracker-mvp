import { z } from "zod";

export const createTimeLogSchema = z.object({
  project_id: z.string().uuid("Invalid project ID"),
  start_time: z.string().datetime("Invalid start time"),
  end_time: z.string().datetime("Invalid end time"),
  description: z.string().optional(),
});

export type CreateTimeLogInput = z.infer<typeof createTimeLogSchema>;
