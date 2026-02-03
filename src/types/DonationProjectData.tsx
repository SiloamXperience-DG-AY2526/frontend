import { z } from 'zod';

const DonationProjectTypeSchema = z.enum(['brick', 'sponsor', 'partnerLed']);

const DonationProjectSubmissionStatusSchema = z.enum([
  'draft',
  'submitted',
  'withdrawn',
]);

const DonationProjectApprovalStatusSchema = z.enum([
  'pending',
  'reviewing',
  'approved',
  'rejected',
]);

const DonationProjectOperationStatusSchema = z.enum([
  'notStarted',
  'ongoing',
  'paused',
  'cancelled',
  'completed',
]);

const ProjectManagerSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
});

const DonationProjectBaseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  location: z.string(),
  about: z.string(),
  objectives: z.string(),
  beneficiaries: z.string().nullable(),
  initiatorName: z.string().nullable(),
  organisingTeam: z.string().nullable(),
  targetFund: z.string().nullable(),
  brickSize: z.string().nullable(),
  deadline: z.string().nullable(),
  type: DonationProjectTypeSchema,
  startDate: z.string(),
  endDate: z.string(),
  image: z.string().nullable(),
  attachments: z.string().nullable(),
  projectManager: ProjectManagerSchema,
  createdAt: z.string(),
  approvalStatus: DonationProjectApprovalStatusSchema.optional(),
  submissionStatus: DonationProjectSubmissionStatusSchema.optional(),
  operationStatus: DonationProjectOperationStatusSchema.optional(),
});

const DonationProjectSchema = DonationProjectBaseSchema.extend({
  totalRaised: z.string(),
});

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  totalPages: z.number(),
});

const DonationProjectsResponseSchema = z.object({
  projects: z.array(DonationProjectSchema),
  pagination: PaginationSchema,
});

const ProjectDonationSchema = z.object({
  id: z.string().uuid(),
  donorId: z.string().uuid(),
  projectId: z.string().uuid(),
  recurringDonationId: z.string().uuid().nullable(),
  type: z.enum(['individual', 'corporate']),
  countryOfResidence: z.string(),
  paymentMode: z.string(),
  date: z.string(),
  amount: z.string(),
  receipt: z.string().nullable(),
  isThankYouSent: z.boolean(),
  isAdminNotified: z.boolean(),
  submissionStatus: z.string(),
  receiptStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const ProjectDonorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  isActive: z.boolean(),
  gender: z.string(),
  contactNumber: z.string(),
  countryCode: z.string(),
  totalDonated: z.string(),
  partner: z
    .object({
      id: z.string().uuid(),
      dob: z.string(),
    })
    .nullable(),
  createdAt: z.string(),
});

const ProjectObjectiveSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  objective: z.string(),
  order: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const DonationProjectDetailSchema = DonationProjectBaseSchema.extend({
  managedBy: z.string().uuid().optional(),
  approvalNotes: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
  objectivesList: z.array(ProjectObjectiveSchema).optional(),
});

const ProjectDonationsResponseSchema = z.object({
  donations: z.array(ProjectDonationSchema),
  pagination: PaginationSchema,
});

const ProjectDonorsResponseSchema = z.object({
  donors: z.array(ProjectDonorSchema),
  pagination: PaginationSchema,
});

const ProjectDetailResponseSchema = z.object({
  project: DonationProjectDetailSchema,
  totalRaised: z.union([z.string(), z.number()]),
});

const DonationProjectWithFinanceSchema = z.object({
  project: DonationProjectDetailSchema,
  totalRaised: z.string(),
  donations: z.array(ProjectDonationSchema),
  donors: z.array(ProjectDonorSchema),
});

export type DonationProjectType = z.infer<typeof DonationProjectTypeSchema>;
export type DonationProjectSubmissionStatus = z.infer<
  typeof DonationProjectSubmissionStatusSchema
>;
export type DonationProjectApprovalStatus = z.infer<
  typeof DonationProjectApprovalStatusSchema
>;
export type DonationProjectOperationStatus = z.infer<
  typeof DonationProjectOperationStatusSchema
>;
export type DonationProject = z.infer<typeof DonationProjectSchema>;
export type DonationProjectsResponse = z.infer<
  typeof DonationProjectsResponseSchema
>;
export type ProjectDonation = z.infer<typeof ProjectDonationSchema>;
export type ProjectDonor = z.infer<typeof ProjectDonorSchema>;
export type ProjectObjective = z.infer<typeof ProjectObjectiveSchema>;
export type DonationProjectDetail = z.infer<typeof DonationProjectDetailSchema>;
export type DonationProjectWithFinance = z.infer<
  typeof DonationProjectWithFinanceSchema
>;

export {
  DonationProjectTypeSchema,
  DonationProjectSubmissionStatusSchema,
  DonationProjectApprovalStatusSchema,
  DonationProjectOperationStatusSchema,
  DonationProjectSchema,
  DonationProjectsResponseSchema,
  ProjectDonationSchema,
  ProjectDonorSchema,
  ProjectObjectiveSchema,
  DonationProjectDetailSchema,
  ProjectDonationsResponseSchema,
  ProjectDonorsResponseSchema,
  ProjectDetailResponseSchema,
  DonationProjectWithFinanceSchema,
};
