import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { LocationView, locationMetadata } from "@/views/location";

export async function generateMetadata({ params }: PageProps<"/[lang]/ubicacion">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? locationMetadata(lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/ubicacion">) {
  const { lang } = await params;
  return <LocationView locale={isLocale(lang) ? lang : "es"} />;
}
