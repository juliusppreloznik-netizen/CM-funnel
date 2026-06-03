import type { Env } from "../lib/env";
import { json } from "../lib/response";

export async function handleHealth(_request: Request, env: Env): Promise<Response> {
  return json({
    ok: true,
    environment: env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  });
}
