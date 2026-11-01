const recentRequests = new Map<string, number[]>();

/** Límite básico por clave. Vive en memoria: se reinicia con el servidor y no se comparte entre instancias. */
export function isRateLimited(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const recent = (recentRequests.get(key) ?? []).filter((time) => now - time < windowMs);
  recentRequests.set(key, [...recent, now]);
  return recent.length >= maxRequests;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

/** Rechaza pedidos enviados desde otros sitios. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
