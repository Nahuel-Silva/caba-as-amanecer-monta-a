import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { ConditionsView, conditionsMetadata } from "@/views/conditions";

export async function generateMetadata({ params }: PageProps<"/[lang]/condiciones-promociones">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? conditionsMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/condiciones-promociones">) {
  const { lang } = await params;
  return <ConditionsView locale={isLocale(lang) ? lang : "es"} />;
}
