/**
 * GoHighLevel (GHL) integration for the CM Funnel Worker.
 *
 * When a lead submits any funnel step, this module creates or updates
 * the corresponding GHL contact with all captured fields and custom data.
 *
 * Location: Catalyst Marketing (xL9tBqCRdWhItIZIBuhY)
 */

import type { Env } from "./env";
import type { FunnelLead } from "@shared/types/funnel";

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

/** GHL custom field IDs for the Catalyst Marketing location */
export const GHL_FIELDS = {
  // New funnel-specific fields (created 2026-06-03)
  funnel_step:       "X170FEmr21r0tkpdPcUC",
  funnel_completed:  "Cs8llg2bhUeOsRvhsHH9",
  consent:           "g3KR6dOkvI3ZuhJctn4t",
  additional_info:   "5vnkVRfZS5hH2ZVIz32v",

  // Pre-existing UTM / tracking fields
  utm_source:        "ssMt1rthqVMaEDVxogb8",
  utm_medium:        "XyYzaSsl90La0jmGgW6l",
  utm_campaign:      "y5eNBLA4UzdOnmXFXD7U",
  utm_content:       "m9r6IevDAmk30vj7nwi1",
  utm_term:          "paPwrb9ASC4wqlzRehJR",
  client_ip_address: "uXmJt0w6B5m8QV20poHg",
  event_id:          "z2nWByzxhKD6Sp4AQaIS",
  ad_id:             "Uc7YdBnmUSaFnFOXplyF",
  adset_id:          "cvLjhjojx4bEaPb8uGJv",
  adset_name:        "zAn9OI2cjKOSCYEocOfG",
  campaign_id:       "TkRy4zpHUeuQTxsmV1jk",
} as const;

/** GHL Location ID for Catalyst Marketing */
export const GHL_LOCATION_ID = "xL9tBqCRdWhItIZIBuhY";

interface GhlContactPayload {
  locationId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  source?: string;
  customFields?: Array<{ id: string; field_value: string | number }>;
}

/**
 * Upserts a GHL contact from funnel lead data.
 * Uses email as the unique identifier for deduplication.
 * Returns the GHL contact ID on success, or null on failure.
 */
export async function upsertGhlContact(
  lead: Partial<FunnelLead>,
  env: Env
): Promise<string | null> {
  const token = env.GHL_API_KEY;
  if (!token) {
    console.warn("[ghl] GHL_API_KEY not set — skipping GHL sync");
    return null;
  }

  const customFields: Array<{ id: string; field_value: string | number }> = [];

  // Funnel tracking fields
  if (lead.currentStep !== undefined) {
    customFields.push({ id: GHL_FIELDS.funnel_step, field_value: lead.currentStep });
  }
  if (lead.completed !== undefined) {
    customFields.push({ id: GHL_FIELDS.funnel_completed, field_value: String(lead.completed) });
  }
  if (lead.consent !== undefined) {
    customFields.push({ id: GHL_FIELDS.consent, field_value: lead.consent ? "Yes" : "No" });
  }
  if (lead.additionalInfo) {
    customFields.push({ id: GHL_FIELDS.additional_info, field_value: lead.additionalInfo });
  }

  // UTM fields
  if (lead.utmSource)   customFields.push({ id: GHL_FIELDS.utm_source,   field_value: lead.utmSource });
  if (lead.utmMedium)   customFields.push({ id: GHL_FIELDS.utm_medium,   field_value: lead.utmMedium });
  if (lead.utmCampaign) customFields.push({ id: GHL_FIELDS.utm_campaign, field_value: lead.utmCampaign });
  if (lead.utmContent)  customFields.push({ id: GHL_FIELDS.utm_content,  field_value: lead.utmContent });
  if (lead.utmTerm)     customFields.push({ id: GHL_FIELDS.utm_term,     field_value: lead.utmTerm });
  if (lead.ipAddress)   customFields.push({ id: GHL_FIELDS.client_ip_address, field_value: lead.ipAddress });

  const payload: GhlContactPayload = {
    locationId: GHL_LOCATION_ID,
    firstName: lead.firstName,
    lastName: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    source: "CM Funnel",
    customFields,
  };

  try {
    // Try to find existing contact by email first
    if (lead.email) {
      const searchRes = await fetch(
        `${GHL_API_BASE}/contacts/search/duplicate?locationId=${GHL_LOCATION_ID}&email=${encodeURIComponent(lead.email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Version: GHL_API_VERSION,
            "Content-Type": "application/json",
          },
        }
      );

      if (searchRes.ok) {
        const searchData = (await searchRes.json()) as { contact?: { id: string } };
        const existingId = searchData?.contact?.id;

        if (existingId) {
          // Update existing contact
          const updateRes = await fetch(`${GHL_API_BASE}/contacts/${existingId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              Version: GHL_API_VERSION,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (updateRes.ok) {
            const updated = (await updateRes.json()) as { contact?: { id: string } };
            return updated?.contact?.id ?? existingId;
          }
        }
      }
    }

    // Create new contact
    const createRes = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error("[ghl] Failed to create contact:", err);
      return null;
    }

    const created = (await createRes.json()) as { contact?: { id: string } };
    return created?.contact?.id ?? null;
  } catch (err) {
    console.error("[ghl] Unexpected error:", err);
    return null;
  }
}
