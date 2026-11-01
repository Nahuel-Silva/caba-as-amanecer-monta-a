import {
  endAdminSession,
  isAdminConfigured,
  isAdminSession,
  isCorrectPassword,
  startAdminSession,
} from "@/lib/admin-auth";
import { clientIp, isRateLimited, isSameOrigin } from "@/lib/request-guard";

export async function GET() {
  return Response.json({ configured: isAdminConfigured, loggedIn: await isAdminSession() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ ok: false, error: "Solicitud no permitida." }, { status: 403 });
  if (isRateLimited(`login:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    return Response.json({ ok: false, error: "Demasiados intentos. Probá de nuevo en 15 minutos." }, { status: 429 });
  }

  const input = (await request.json().catch(() => null)) as { password?: unknown } | null;
  if (!isCorrectPassword(input?.password)) {
    return Response.json({ ok: false, error: "Contraseña incorrecta." }, { status: 401 });
  }

  await startAdminSession();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ ok: false }, { status: 403 });
  await endAdminSession();
  return Response.json({ ok: true });
}
