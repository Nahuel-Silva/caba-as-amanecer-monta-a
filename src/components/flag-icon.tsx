import type { Locale } from "@/i18n/config";

/**
 * Bandera de cada idioma: Argentina (español), Brasil (portugués) y Estados Unidos (inglés).
 * Dibujadas en SVG porque los emojis de banderas no se ven en Windows (aparecen como letras).
 */
export function FlagIcon({ locale }: { locale: Locale }) {
  return (
    <svg aria-hidden="true" className="flag-icon" viewBox="0 0 30 20">
      {locale === "es" && (
        <>
          <rect fill="#74acdf" height="20" width="30" />
          <rect fill="#fff" height="6.67" width="30" y="6.67" />
          <circle cx="15" cy="10" fill="#f6b40e" r="2.4" />
        </>
      )}
      {locale === "pt" && (
        <>
          <rect fill="#009c3b" height="20" width="30" />
          <path d="M15 2.5 27 10 15 17.5 3 10Z" fill="#ffdf00" />
          <circle cx="15" cy="10" fill="#002776" r="4.2" />
          <path d="M11 9.2c2.6-.6 5.5-.3 8 .9" fill="none" stroke="#fff" strokeWidth=".8" />
        </>
      )}
      {locale === "en" && (
        <>
          <rect fill="#fff" height="20" width="30" />
          {[0, 2, 4, 6, 8, 10, 12].map((stripe) => (
            <rect fill="#b22234" height="1.54" key={stripe} width="30" y={stripe * 1.54} />
          ))}
          <rect fill="#3c3b6e" height="10.77" width="12" />
          {[2.2, 5.2, 8.2].map((y) => [2, 6, 10].map((x) => <circle cx={x} cy={y} fill="#fff" key={`${x}-${y}`} r=".6" />))}
        </>
      )}
    </svg>
  );
}
