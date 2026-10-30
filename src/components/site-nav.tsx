"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./site-nav.css";

export const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/cabanas", label: "Cabañas" },
  { href: "/promociones", label: "Promociones" },
  { href: "/malargue", label: "Malargüe" },
  { href: "/ubicacion", label: "Ubicación" },
  { href: "/preguntas", label: "Preguntas" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Navegación principal: marca la pestaña actual con aria-current="page". */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="main-nav">
      {navItems.map((item) => (
        <Link
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
