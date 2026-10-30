import Image from "next/image";
import "./brand-logo.css";

/**
 * Logo horizontal de Amanecer de Montaña.
 * "dark" (letras negras) va sobre fondos claros; "light" (letras blancas) sobre fondos oscuros.
 * El texto accesible lo aporta el enlace que lo contiene (aria-label), por eso alt va vacío.
 */
export function BrandLogo({ tone = "dark", priority = false }: { tone?: "dark" | "light"; priority?: boolean }) {
  return (
    <Image
      alt=""
      className={`brand-logo brand-logo-${tone}`}
      height={583}
      priority={priority}
      src={tone === "dark" ? "/brand/logo-negro.png" : "/brand/logo-blanco.png"}
      width={929}
    />
  );
}
