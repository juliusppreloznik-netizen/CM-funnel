import type { Env } from "../lib/env";
import { json, jsonError } from "../lib/response";
import { partialLeadSchema } from "@shared/validation/funnel";

/**
 * POST /api/leads
 * Creates a new lead record in D1.
 * Returns the generated UUID so the client can reference it on subsequent steps.
 */
export async function handleCreateLead(
  request: Request,
  env: Env
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = partialLeadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Validation error", 422);
  }

  const data = parsed.data;
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // Capture UTM params and metadata from request
  const url = new URL(request.url);
  const utmSource = url.searchParams.get("utm_source") ?? data.utmSource ?? null;
  const utmMedium = url.searchParams.get("utm_medium") ?? data.utmMedium ?? null;
  const utmCampaign = url.searchParams.get("utm_campaign") ?? data.utmCampaign ?? null;
  const utmContent = url.searchParams.get("utm_content") ?? data.utmContent ?? null;
  const utmTerm = url.searchParams.get("utm_term") ?? data.utmTerm ?? null;
  const ipAddress = request.headers.get("CF-Connecting-IP") ?? null;
  const userAgent = request.headers.get("User-Agent") ?? null;

  await env.DB.prepare(
    `INSERT INTO leads (
      id, first_name, last_name, email, phone,
      qualifier_one, qualifier_two, additional_info, consent,
      current_step, completed,
      utm_source, utm_medium, utm_campaign, utm_content, utm_term,
      ip_address, user_agent,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?,
      ?, ?
    )`
  )
    .bind(
      id,
      data.firstName ?? null,
      data.lastName ?? null,
      data.email ?? null,
      data.phone ?? null,
      data.qualifierOne ?? null,
      data.qualifierTwo ?? null,
      data.additionalInfo ?? null,
      data.consent ? 1 : 0,
      data.currentStep ?? 1,
      data.completed ? 1 : 0,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      ipAddress,
      userAgent,
      now,
      now
    )
    .run();

  return json({ id }, 201);
}

/**
 * PATCH /api/leads/:id
 * Updates an existing lead record with new step data.
 */
export async function handleUpdateLead(
  request: Request,
  env: Env,
  id: string
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = partialLeadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Validation error", 422);
  }

  const data = parsed.data;
  const now = new Date().toISOString();

  // Build a dynamic SET clause from provided fields
  const fields: string[] = [];
  const values: unknown[] = [];

  const fieldMap: Record<string, string> = {
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    phone: "phone",
    qualifierOne: "qualifier_one",
    qualifierTwo: "qualifier_two",
    additionalInfo: "additional_info",
    consent: "consent",
    currentStep: "current_step",
    completed: "completed",
    utmSource: "utm_source",
    utmMedium: "utm_medium",
    utmCampaign: "utm_campaign",
    utmContent: "utm_content",
    utmTerm: "utm_term",
  };

  for (const [jsKey, dbCol] of Object.entries(fieldMap)) {
    if (jsKey in data) {
      fields.push(`${dbCol} = ?`);
      const val = (data as Record<string, unknown>)[jsKey];
      values.push(typeof val === "boolean" ? (val ? 1 : 0) : val);
    }
  }

  if (fields.length === 0) {
    return jsonError("No updatable fields provided", 400);
  }

  fields.push("updated_at = ?");
  values.push(now);
  values.push(id);

  const result = await env.DB.prepare(
    `UPDATE leads SET ${fields.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();

  if (result.meta.changes === 0) {
    return jsonError("Lead not found", 404);
  }

  return json({ id });
}
