import { z } from 'zod';

// Zod schemas for runtime validation
export const DonorSchema = z.object({
  donorId: z.string(),
  partnerName: z.string(),
  projects: z.array(z.string()),
  cumulativeAmount: z.number(),
  gender: z.enum(['male', 'female', 'others']),
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
  gender: z.enum(['male', 'female', 'others']),
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

// Backend response Zod schemas for validation
const BackendDonorSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    title: z.string().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    managedDonationProjects: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
      })
    ),
  }),
  gender: z.string(),
  contactNumber: z.string(),
  nationality: z.string(),
  identificationNumber: z.string(),
  dob: z.string(),
  occupation: z.string(),
  otherContactModes: z.string().nullable(),
  contactModes: z.array(
    z.object({
      mode: z.string(),
    })
  ),
  totalDonations: z.union([z.string(), z.number()]),
});

export const BackendDonorsResponseSchema = z.object({
  donor: z.array(BackendDonorSchema).optional(),
  donors: z.array(BackendDonorSchema).optional(),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    totalCount: z.number(),
    totalPages: z.number(),
  }),
});

const BackendDonationSchema = z.object({
  id: z.string(),
  project: z.string(),
  amount: z.number(),
  receipt: z.string(),
  date: z.string(),
});

export const BackendDonorDetailResponseSchema = z.object({
  donorDetails: z.object({
    user: z.object({
      id: z.string(),
      title: z.string().nullable(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      managedDonationProjects: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
        })
      ),
    }),
    gender: z.string(),
    contactNumber: z.string(),
    nationality: z.string(),
    identificationNumber: z.string(),
    dob: z.string(),
    occupation: z.string(),
    otherContactModes: z.string().nullable(),
    contactModes: z.array(
      z.object({
        mode: z.string(),
      })
    ),
  }),
  donationHistory: z.object({
    donations: z.array(BackendDonationSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      totalCount: z.number(),
      totalPages: z.number(),
    }),
  }),
});

// TypeScript types for backend responses
export type BackendDonor = z.infer<typeof BackendDonorSchema>;
export type BackendDonorsResponse = z.infer<typeof BackendDonorsResponseSchema>;
export type BackendDonorDetailResponse = z.infer<
  typeof BackendDonorDetailResponseSchema
>;
