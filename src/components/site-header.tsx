import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/content/site";
import { localizePath, type Locale } from "@/i18n/config";
import { ui } from "@/i18n/ui";

export function SiteHeader({ locale = "es" }: { locale?: Locale }) {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link aria-label={ui[locale].brandHome(site.name)} className="brand" href={localizePath(locale, "/")}>
          <BrandLogo tone="dark" priority />
        </Link>
        <div className="header-end">
          <SiteNav />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
