import { tokenPattern } from "@/lib/subscribers";
import { unsubscribe } from "@/lib/subscribers-db";

/**
 * Baja con un clic (RFC 8058): Gmail y otros programas de mail llaman a esta dirección con POST cuando la persona
 * toca "Anular suscripción" junto al remitente. No pide nada más: el código del enlace identifica a la persona.
 * Con GET no hace nada, porque los antivirus del mail abren los enlaces solos.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (!tokenPattern.test(token)) return new Response("Enlace no válido.", { status: 400 });
  try {
    await unsubscribe(token);
    return new Response("Listo, no vas a recibir más promociones.", { status: 200 });
  } catch (error) {
    console.error("No se pudo dar de baja la suscripción", error);
    return new Response("No pudimos hacer el cambio.", { status: 502 });
  }
}
