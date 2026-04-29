// Rate limiter in-memory minimaliste pour le MVP.
// Phase 4 : remplacer par Upstash / Redis pour partager l'état entre instances.

const buckets = new Map<string, { count: number; resetAt: number }>();

export type RateLimitOptions = {
  windowMs: number;
  max: number;
};

export function rateLimit(key: string, opts: RateLimitOptions): {
  ok: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > opts.max) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
