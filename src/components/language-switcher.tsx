"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FlagIcon } from "@/components/flag-icon";
import { localeNames, locales, localizePath, splitLocalePath, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { ui } from "@/i18n/ui";
import "./language-switcher.css";

const dismissedKey = "idioma-sugerencia-cerrada";

/**
 * Selector de idioma ("ES · PT · EN") que lleva a la misma página en otro idioma.
 * Se usan enlaces comunes (no de Next.js) porque cada idioma tiene su propio diseño raíz y la página se recarga igual.
 */
export function LanguageSwitcher() {
  const current = useLocale();
  const { path } = splitLocalePath(usePathname());

  return (
    <nav aria-label={ui[current].language.label} className="language-switcher">
      {locales.map((locale) => (
        <a
          aria-current={locale === current ? "true" : undefined}
          href={localizePath(locale, path)}
          hrefLang={locale}
          key={locale}
          lang={locale}
          title={localeNames[locale]}
        >
          <FlagIcon locale={locale} />
          {locale.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}

/**
 * Si el navegador está en portugués o inglés y la página está en español, sugiere una vez la otra versión.
 * Va fuera del encabezado (en RootShell) para quedar por encima de todo.
 */
export function LanguageSuggestion() {
  const current = useLocale();
  const { path } = splitLocalePath(usePathname());
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    if (current !== "es") return;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(dismissedKey) === "1";
    } catch {
      // Sin acceso al almacenamiento: se muestra la sugerencia igual.
    }
    if (dismissed) return;
    const browser = (navigator.languages?.[0] ?? navigator.language ?? "").slice(0, 2).toLowerCase();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el idioma del navegador solo se conoce en el navegador
    if (browser === "pt" || browser === "en") setSuggested(browser);
  }, [current]);

  if (!suggested || path.startsWith("/admin")) return null;

  function dismiss() {
    setSuggested(null);
    try {
      localStorage.setItem(dismissedKey, "1");
    } catch {
      // Sin acceso al almacenamiento: se cierra solo por esta vez.
    }
  }

  const t = ui[suggested].language;
  return (
    <div aria-label={t.label} className="language-suggestion" lang={suggested} role="region">
      <p>{t.suggestion}</p>
      <a className="button button-primary" href={localizePath(suggested, path)} hrefLang={suggested} onClick={dismiss}>
        {t.suggestionAction}
      </a>
      <button aria-label={t.dismiss} className="language-suggestion-close" onClick={dismiss} type="button">
        ×
      </button>
    </div>
  );
}
