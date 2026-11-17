import type { Metadata } from "next";
import type { ReactNode } from "react";
import { sans, serif } from "@/app/fonts";
import { ContactMenu } from "@/components/contact-menu";
import { InstagramFloat } from "@/components/instagram-float";
import { LanguageSuggestion } from "@/components/language-switcher";
import { PhoneFloat } from "@/components/phone-float";
import { ReservationDialog } from "@/components/reservation-dialog";
import { SeasonalEffects } from "@/components/seasonal-effects";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/content/site";
import { htmlLang, ogLocale, type Locale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/locale-context";
import { showReservationForm } from "@/lib/reservation-email";
import { defaultDescriptions, metadataBase, robotsMetadata } from "@/lib/seo";
import "@/app/globals.css";

/**
 * Estructura común de todas las páginas, en cualquier idioma: <html>, fuentes, decoración de la estación,
 * formulario de reserva y menú de contacto. La usan app/(es)/layout.tsx y app/[lang]/layout.tsx.
 */
export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={htmlLang[locale]} data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <LocaleProvider locale={locale}>
          {children}
          <LanguageSuggestion />
          <SeasonalEffects />
          <div className="contact-floats">
            {showReservationForm && <ReservationDialog />}
            <ContactMenu>
              <WhatsAppFloat locale={locale} />
              <InstagramFloat locale={locale} />
              <PhoneFloat />
            </ContactMenu>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}

/** Metadatos generales de cada idioma; cada página agrega su título y descripción. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    metadataBase,
    title: {
      default: `${site.name} | Malargüe`,
      template: `%s | ${site.name}`,
    },
    description: defaultDescriptions[locale],
    robots: robotsMetadata,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      siteName: site.name,
    },
  };
}
