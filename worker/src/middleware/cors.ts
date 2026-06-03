/**
 * Returns CORS headers for API responses.
 * In production, restrict the origin to your actual domain.
 */
export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") ?? "*";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}
