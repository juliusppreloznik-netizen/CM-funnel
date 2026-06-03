/**
 * Cloudflare Worker environment bindings.
 * These are injected at runtime via wrangler.toml bindings.
 */
export interface Env {
  /** D1 database — primary lead storage */
  DB: D1Database;

  /** KV namespace — session tokens and lightweight cache */
  KV: KVNamespace;

  /** Static assets binding — serves the built React SPA */
  ASSETS: Fetcher;

  /** Deployment environment */
  ENVIRONMENT: string;

  /** Funnel display name */
  FUNNEL_NAME: string;

  // Secrets (set via `wrangler secret put`)
  /** Supabase project URL */
  SUPABASE_URL?: string;
  /** Supabase anon/public key */
  SUPABASE_ANON_KEY?: string;
  /** Supabase service role key (server-side only) */
  SUPABASE_SERVICE_ROLE_KEY?: string;
  /** JWT signing secret */
  JWT_SECRET?: string;
}
