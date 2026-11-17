"use client";

import { createContext, useContext, type ReactNode } from "react";
import { defaultLocale, type Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Comparte el idioma de la página con los componentes interactivos (barra de reserva, formularios…). */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

/** Textos de la interfaz en el idioma de la página. */
export function useUi() {
  return ui[useLocale()];
}
