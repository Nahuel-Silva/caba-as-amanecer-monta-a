import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { CabinsView, cabinsMetadata } from "@/views/cabins";

export async function generateMetadata({ params }: PageProps<"/[lang]/cabanas">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? cabinsMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/cabanas">) {
  const { lang } = await params;
  return <CabinsView locale={isLocale(lang) ? lang : "es"} />;
}
