import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { PromotionView, promotionMetadata } from "@/views/promotions";

export async function generateMetadata({ params }: PageProps<"/[lang]/promociones/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  return isLocale(lang) ? promotionMetadata(slug, lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/promociones/[slug]">) {
  const { lang, slug } = await params;
  return <PromotionView locale={isLocale(lang) ? lang : "es"} slug={slug} />;
}
