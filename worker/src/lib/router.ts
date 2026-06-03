import type { Env } from "./env";
import { handleHealth } from "../routes/health";
import { handleCreateLead, handleUpdateLead } from "../routes/leads";
import { jsonError } from "./response";
import { corsHeaders } from "../middleware/cors";

/**
 * Simple pattern-based router for the Worker API.
 * Extend by adding new route handlers under worker/src/routes/.
 */
export async function router(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, ""); // strip trailing slash
  const method = request.method.toUpperCase();

  let response: Response;

  try {
    if (path === "/api/health" && method === "GET") {
      response = await handleHealth(request, env);
    } else if (path === "/api/leads" && method === "POST") {
      response = await handleCreateLead(request, env);
    } else if (path.match(/^\/api\/leads\/[^/]+$/) && method === "PATCH") {
      const id = path.split("/").pop()!;
      response = await handleUpdateLead(request, env, id);
    } else {
      response = jsonError("Not found", 404);
    }
  } catch (err) {
    console.error("[router]", err);
    response = jsonError("Internal server error", 500);
  }

  // Attach CORS headers to every API response
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(request)).forEach(([k, v]) => headers.set(k, v));

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
