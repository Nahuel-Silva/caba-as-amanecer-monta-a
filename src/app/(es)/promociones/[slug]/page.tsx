import type { Metadata } from "next";
import { PromotionView, promotionMetadata } from "@/views/promotions";

export async function generateMetadata({ params }: PageProps<"/promociones/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return promotionMetadata(slug, "es");
}

export default async function Page({ params }: PageProps<"/promociones/[slug]">) {
  const { slug } = await params;
  return <PromotionView locale="es" slug={slug} />;
}
