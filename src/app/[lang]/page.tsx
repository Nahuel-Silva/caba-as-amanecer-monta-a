import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { HomeView, homeMetadata } from "@/views/home";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? homeMetadata(lang) : {};
}

export default async function TranslatedHome({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return <HomeView locale={isLocale(lang) ? lang : "es"} />;
}
