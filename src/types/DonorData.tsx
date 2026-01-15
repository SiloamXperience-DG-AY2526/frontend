import { z } from 'zod';

// Zod schemas for runtime validation
export const DonorSchema = z.object({
  donorId: z.string(),
  partnerName: z.string(),
  projects: z.array(z.string()),
  cumulativeAmount: z.number(),
  gender: z.enum(['Male', 'Female', 'Other']),
  contactNumber: z.string(),
  status: z.enum(['Active', 'Inactive']),
});

export const DonationSchema = z.object({
  id: z.string(),
  project: z.string(),
  amount: z.number(),
  receipt: z.enum(['Pending', 'Issued']),
  date: z.string(),
});

export const DonorDetailSchema = z.object({
  donorId: z.string(),
  fullName: z.string(),
  prefixTitle: z.string(),
  birthday: z.string(),
  gender: z.enum(['Male', 'Female', 'Other']),
  occupation: z.string(),
  nationality: z.string(),
  phoneNumber: z.string(),
  preferredCommunicationMethod: z.string(),
  donations: z.array(DonationSchema),
  cumulativeAmount: z.number(),
  projects: z.array(z.string()),
  status: z.enum(['Active', 'Inactive']),
});

// TypeScript types inferred from Zod schemas
export type Donor = z.infer<typeof DonorSchema>;
export type DonorTableData = Donor[];
export type Donation = z.infer<typeof DonationSchema>;
export type DonorDetail = z.infer<typeof DonorDetailSchema>;
