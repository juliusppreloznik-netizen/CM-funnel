/**
 * Shared types used by both the Cloudflare Worker backend
 * and the React frontend client.
 */

/** Full lead data model stored in D1 and forwarded to Supabase */
export interface FunnelLead {
  /** Auto-generated UUID assigned on first submission */
  id: string;

  // Step 1 — Contact info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 2 — Qualification
  qualifierOne: string;
  qualifierTwo: string;

  // Step 3 — Additional details
  additionalInfo: string;
  consent: boolean;

  // Metadata
  currentStep: number;
  completed: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

/** Generic API response envelope */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
