import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { SiteNav } from "@/components/site-nav";
import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link aria-label={`${site.name}, inicio`} className="brand" href="/">
          <BrandLogo tone="dark" priority />
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}