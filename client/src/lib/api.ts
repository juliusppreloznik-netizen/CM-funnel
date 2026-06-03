/**
 * Typed API client for the CM Funnel Cloudflare Worker backend.
 * All requests are made to the same-origin /api/* endpoints.
 */

import type { FunnelLead, ApiResponse } from "@shared/types/funnel";

const BASE = "/api";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      success: false,
      error: (data as { error?: string }).error ?? "An unexpected error occurred.",
    };
  }

  return { success: true, data: data as T };
}

/** Submit a full or partial lead capture at any funnel step */
export async function submitLead(
  lead: Partial<FunnelLead>
): Promise<ApiResponse<{ id: string }>> {
  return request("/leads", {
    method: "POST",
    body: JSON.stringify(lead),
  });
}

/** Update an existing lead by ID (used on subsequent steps) */
export async function updateLead(
  id: string,
  updates: Partial<FunnelLead>
): Promise<ApiResponse<{ id: string }>> {
  return request(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

/** Health check */
export async function ping(): Promise<ApiResponse<{ ok: boolean }>> {
  return request("/health");
}
