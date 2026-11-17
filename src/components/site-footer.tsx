import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { site } from "@/content/site";
import { localizePath, type Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

export function SiteFooter({ locale = "es" }: { locale?: Locale }) {
  const t = ui[locale];
  const to = (path: string) => localizePath(locale, path);

  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <Link aria-label={t.brandHome(site.name)} className="brand" href={to("/")}>
          <BrandLogo tone="light" />
        </Link>
        <nav aria-label={t.footer.label} className="footer-links">
          <Link href={to("/cabanas")}>{t.nav.cabins}</Link>
          <Link href={to("/promociones")}>{t.nav.promotions}</Link>
          <Link href={to("/malargue")}>{t.nav.malargue}</Link>
          <Link href={to("/ubicacion")}>{t.nav.location}</Link>
          <Link href={to("/preguntas")}>{t.nav.faq}</Link>
          <Link href={to("/condiciones-promociones")}>{t.footer.conditions}</Link>
        </nav>
      </div>
    </footer>
  );
}
