import { z } from "zod";

/** Step 1 — Contact information */
export const stepOneSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s\-().]+$/, "Please enter a valid phone number"),
});

export type StepOneData = z.infer<typeof stepOneSchema>;

/** Step 2 — Qualification questions */
export const stepTwoSchema = z.object({
  qualifierOne: z.string().min(1, "Please select an option"),
  qualifierTwo: z.string().min(1, "Please select an option"),
});

export type StepTwoData = z.infer<typeof stepTwoSchema>;

/** Step 3 — Final details and consent */
export const stepThreeSchema = z.object({
  additionalInfo: z.string().max(2000).optional().default(""),
  consent: z.boolean().refine((v) => v === true, {
    message: "You must agree to continue",
  }),
});

export type StepThreeData = z.infer<typeof stepThreeSchema>;

/** Full lead submission schema (union of all steps) */
export const leadSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .extend({
    id: z.string().uuid().optional(),
    currentStep: z.number().int().min(1).max(3).optional(),
    completed: z.boolean().optional(),
    utmSource: z.string().optional(),
    utmMedium: z.string().optional(),
    utmCampaign: z.string().optional(),
    utmContent: z.string().optional(),
    utmTerm: z.string().optional(),
  });

export type LeadData = z.infer<typeof leadSchema>;

/** Partial lead schema used for PATCH updates */
export const partialLeadSchema = leadSchema.partial();
export type PartialLeadData = z.infer<typeof partialLeadSchema>;
