import { z } from 'zod';

// Zod schemas for runtime validation
export const ManagerScehema = z.object({
  id: z.string(),
  name: z.string(),
  projects: z.array(z.string()),
  email: z.string(),
  role: z.enum(['Project Manager', 'Finance Manager']),
  status: z.enum(['Active', 'Inactive']),
});

// TypeScript types inferred from Zod schemas
export type Manager = z.infer<typeof ManagerScehema>;

// Backend response Zod schemas for validation
const BackendManagerSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  role: z.string(),
  isActive: z.boolean(),
  managedProjects: z.array(z.string()),
});

export const BackendManagersResponseSchema = z.object({
  data: z.array(BackendManagerSchema)
});

// TypeScript types for backend responses
export type BackendManager = z.infer<typeof BackendManagerSchema>;
export type BackendManagersResponse = z.infer<typeof BackendManagersResponseSchema>;