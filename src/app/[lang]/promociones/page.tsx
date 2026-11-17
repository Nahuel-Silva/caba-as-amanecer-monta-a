import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { PromotionsView, promotionsMetadata } from "@/views/promotions";

export async function generateMetadata({ params }: PageProps<"/[lang]/promociones">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? promotionsMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/promociones">) {
  const { lang } = await params;
  return <PromotionsView locale={isLocale(lang) ? lang : "es"} />;
}
