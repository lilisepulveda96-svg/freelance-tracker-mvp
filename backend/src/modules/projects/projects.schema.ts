import { z } from "zod";

const projectStatus = z.enum(["active", "paused", "completed", "archived"]);

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  customer_id: z.string().uuid("Invalid customer ID").optional(),
  description: z.string().optional(),
  status: projectStatus.default("active"),
  hourly_rate: z.number().positive().optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  customer_id: z.string().uuid("Invalid customer ID").nullable().optional(),
  description: z.string().nullable().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
