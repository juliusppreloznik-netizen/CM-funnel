/**
 * CM Funnel — Cloudflare Worker
 *
 * Architecture:
 *  - Static assets (React SPA) are served from the ASSETS binding
 *  - API routes are handled by this Worker under /api/*
 *  - D1 is used for local/durable lead storage
 *  - KV is used for lightweight session/cache storage
 *  - Supabase integration will be wired in a subsequent phase
 */

import type { Env } from "./lib/env";
import { router } from "./lib/router";
import { corsHeaders } from "./middleware/cors";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    // Route API requests to the Worker router
    if (url.pathname.startsWith("/api/")) {
      return router(request, env, ctx);
    }

    // All other requests fall through to the static asset binding (React SPA)
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
