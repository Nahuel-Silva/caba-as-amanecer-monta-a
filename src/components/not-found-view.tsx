"use client";

import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { pages } from "@/i18n/pages";

/** Página "no encontrada" en el idioma de la sección. */
export function NotFoundView() {
  const locale = useLocale();
  const t = pages[locale].notFound;

  return (
    <main className="wrap page-heading" style={{ paddingBottom: 96 }}>
      <p className="eyebrow">404</p>
      <h1>{t.title}</h1>
      <p className="section-intro">{t.text}</p>
      <p>
        <Link className="button button-primary" href={localizePath(locale, "/")}>{t.home}</Link>
      </p>
    </main>
  );
}
