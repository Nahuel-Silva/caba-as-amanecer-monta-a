"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localizePath, splitLocalePath } from "@/i18n/config";
import { useLocale, useUi } from "@/i18n/locale-context";
import "./site-nav.css";

export const navPaths = ["/", "/cabanas", "/promociones", "/malargue", "/ubicacion", "/preguntas"] as const;

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path === href || path.startsWith(`${href}/`);
}

/** Navegación principal: marca la pestaña actual con aria-current="page". */
export function SiteNav() {
  const { path } = splitLocalePath(usePathname());
  const locale = useLocale();
  const t = useUi().nav;
  const labels = { "/": t.home, "/cabanas": t.cabins, "/promociones": t.promotions, "/malargue": t.malargue, "/ubicacion": t.location, "/preguntas": t.faq };

  return (
    <nav aria-label={t.label} className="main-nav">
      {navPaths.map((href) => (
        <Link aria-current={isActive(path, href) ? "page" : undefined} href={localizePath(locale, href)} key={href}>
          {labels[href]}
        </Link>
      ))}
    </nav>
  );
}
