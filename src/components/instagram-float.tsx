import { site } from "@/content/site";
import type { Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

/** Opción de Instagram del menú de contacto. */
export function InstagramFloat({ locale = "es" }: { locale?: Locale }) {
  if (!site.instagramUrl) return null;
  const t = ui[locale].contact;

  return (
    <a
      aria-label={t.instagramLabel}
      className="contact-option is-instagram"
      href={site.instagramUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span aria-hidden="true" className="contact-option-label">{t.instagram}</span>
      <span className="contact-option-icon">
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="18" rx="5" width="18" x="3" y="3" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" fill="currentColor" r="1.1" stroke="none" />
      </svg>
      </span>
    </a>
  );
}
