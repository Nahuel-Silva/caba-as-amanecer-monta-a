import { connection } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { clientIp, isRateLimited, isSameOrigin } from "@/lib/request-guard";
import { needsReview } from "@/lib/review-moderation";
import { createReview, listApprovedReviews, validateReview } from "@/lib/reviews-db";

const respond = (status: number, body: { ok: boolean; published?: boolean; error?: string }) => Response.json(body, { status });

export async function GET() {
  await connection();
  const headers = { "Cache-Control": "no-store" };
  if (!isDatabaseConfigured) return Response.json({ reviews: [] }, { headers });

  try {
    return Response.json({ reviews: await listApprovedReviews() }, { headers });
  } catch (error) {
    console.error("No se pudieron leer las reseñas", error);
    return Response.json({ reviews: [] }, { headers });
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return respond(403, { ok: false, error: "Solicitud no permitida." });
  if (!isDatabaseConfigured) return respond(503, { ok: false, error: "Las reseñas todavía no están disponibles." });
  if (isRateLimited(`review:${clientIp(request)}`, 3, 60 * 60 * 1000)) {
    return respond(429, { ok: false, error: "Enviaste varias reseñas seguidas. Probá de nuevo más tarde." });
  }

  const input: unknown = await request.json().catch(() => null);
  if (typeof input !== "object" || input === null) return respond(400, { ok: false, error: "Datos inválidos." });
  const fields = input as Record<string, unknown>;

  const { data, error } = validateReview(fields);
  if (!data) return respond(400, { ok: false, error });

  // Campo oculto: lo completan los robots, pero también algún autocompletado. Nunca se descarta en silencio.
  const looksLikeSpam = Boolean(fields.hp_token);
  if (looksLikeSpam) console.warn("Reseña marcada como posible spam: se guarda como rechazada.");

  // Se publica sola, aunque sea negativa. Solo esperan revisión las que tienen insultos o enlaces.
  const held = needsReview(data.author, data.title, data.quote);
  const status = looksLikeSpam ? "rejected" : held ? "pending" : "approved";

  try {
    await createReview(data, status);
    return respond(200, { ok: true, published: status === "approved" });
  } catch (saveError) {
    console.error("No se pudo guardar la reseña", saveError);
    return respond(502, { ok: false, error: "No pudimos guardar tu reseña. Probá de nuevo más tarde." });
  }
}
