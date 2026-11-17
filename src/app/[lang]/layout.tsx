import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RootShell, rootMetadata } from "@/components/root-shell";
import { isLocale, prefixedLocales } from "@/i18n/config";

/**
 * Diseño raíz de las versiones traducidas: /pt/... y /en/...
 * Solo existen esos idiomas: cualquier otro prefijo da "página no encontrada".
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return prefixedLocales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? rootMetadata(lang) : {};
}

export default async function TranslatedLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang) || lang === "es") notFound();
  return <RootShell locale={lang}>{children}</RootShell>;
}
