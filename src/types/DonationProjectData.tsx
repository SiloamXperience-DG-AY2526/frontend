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

const DonationProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  location: z.string(),
  about: z.string(),
  objectives: z.string(),
  beneficiaries: z.string().nullable(),
  initiatorName: z.string().nullable(),
  organisingTeam: z.string().nullable(),
  targetFund: z.string().nullable(),
  totalRaised: z.string(),
  brickSize: z.string().nullable(),
  deadline: z.string(),
  type: DonationProjectTypeSchema,
  startDate: z.string(),
  endDate: z.string(),
  image: z.string().nullable(),
  attachments: z.string().nullable(),
  projectManager: ProjectManagerSchema,
  createdAt: z.string(),
  approvalStatus: DonationProjectApprovalStatusSchema,
  submissionStatus: DonationProjectSubmissionStatusSchema,
  operationStatus: DonationProjectOperationStatusSchema,
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
  donorName: z.string(),
  amount: z.number(),
  date: z.string(),
  paymentMode: z.string(),
});

const ProjectRefundSchema = z.object({
  requestorName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  amount: z.number(),
  paymentMode: z.string(),
  refundStatus: z.enum(['pending', 'refunded']),
});

const ProjectDonorSchema = z.object({
  donorId: z.string(),
  partnerName: z.string(),
  projects: z.array(z.string()),
  cumulativeAmount: z.number(),
  gender: z.enum(['male', 'female', 'others']),
  contactNumber: z.string(),
  status: z.enum(['Active', 'Inactive']),
});

const DonationProjectWithFinanceSchema = DonationProjectSchema.extend({
  donations: z.array(ProjectDonationSchema),
  refunds: z.array(ProjectRefundSchema),
  donors: z.array(ProjectDonorSchema),
});

export type DonationProjectType = z.infer<typeof DonationProjectTypeSchema>;
export type DonationProjectSubmissionStatus = z.infer<
  typeof DonationProjectSubmissionStatusSchema
>;
export type DonationProjectApprovalStatus = z.infer<
  typeof DonationProjectApprovalStatusSchema
>;
export type DonationProject = z.infer<typeof DonationProjectSchema>;
export type DonationProjectsResponse = z.infer<
  typeof DonationProjectsResponseSchema
>;
export type ProjectDonation = z.infer<typeof ProjectDonationSchema>;
export type ProjectRefund = z.infer<typeof ProjectRefundSchema>;
export type ProjectDonor = z.infer<typeof ProjectDonorSchema>;
export type DonationProjectWithFinance = z.infer<
  typeof DonationProjectWithFinanceSchema
>;

export {
  DonationProjectTypeSchema,
  DonationProjectSubmissionStatusSchema,
  DonationProjectApprovalStatusSchema,
  DonationProjectSchema,
  DonationProjectsResponseSchema,
  ProjectDonationSchema,
  ProjectRefundSchema,
  ProjectDonorSchema,
  DonationProjectWithFinanceSchema,
};
