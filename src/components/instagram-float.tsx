import { site } from "@/content/site";

/** Botón fijo de Instagram, arriba del de WhatsApp, en todas las páginas. */
export function InstagramFloat() {
  if (!site.instagramUrl) return null;

  return (
    <a
      aria-label="Instagram de las cabañas (se abre en una pestaña nueva)"
      className="ig-float"
      href={site.instagramUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
        <rect height="18" rx="5" width="18" x="3" y="3" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" fill="currentColor" r="1.1" stroke="none" />
      </svg>
    </a>
  );
}
