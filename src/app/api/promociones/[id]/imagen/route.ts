import { connection } from "next/server";
import { isDatabaseConfigured } from "@/lib/db";
import { getPromotionImage } from "@/lib/promotions-db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await connection();
  const id = Number((await params).id);
  if (!isDatabaseConfigured || !Number.isInteger(id)) return new Response(null, { status: 404 });

  try {
    const image = await getPromotionImage(id);
    if (!image) return new Response(null, { status: 404 });

    // La dirección de la foto cambia al editar la promoción, por eso se puede guardar en caché por mucho tiempo.
    return new Response(image, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("No se pudo leer la foto de la promoción", error);
    return new Response(null, { status: 502 });
  }
}
