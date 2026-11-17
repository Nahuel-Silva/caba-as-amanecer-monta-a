import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { FaqView, faqMetadata } from "@/views/faq";

export async function generateMetadata({ params }: PageProps<"/[lang]/preguntas">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? faqMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/preguntas">) {
  const { lang } = await params;
  return <FaqView locale={isLocale(lang) ? lang : "es"} />;
}
