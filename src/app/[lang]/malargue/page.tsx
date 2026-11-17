import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { MalargueView, malargueMetadata } from "@/views/malargue";

export async function generateMetadata({ params }: PageProps<"/[lang]/malargue">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? malargueMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/malargue">) {
  const { lang } = await params;
  return <MalargueView locale={isLocale(lang) ? lang : "es"} />;
}
