import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getCabins } from "@/lib/cabins";
import { CabinView, cabinMetadata } from "@/views/cabins";

export function generateStaticParams() {
  return getCabins().map((cabin) => ({ slug: cabin.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/cabanas/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  return isLocale(lang) ? cabinMetadata(slug, lang) : {};
}

export default async function Page({ params }: PageProps<"/[lang]/cabanas/[slug]">) {
  const { lang, slug } = await params;
  return <CabinView locale={isLocale(lang) ? lang : "es"} slug={slug} />;
}
