import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubscriptionAction } from "@/components/subscription-action";
import { localizePath, type Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { tokenPattern } from "@/lib/subscribers";

// Página a la que llevan los enlaces de los mails. Nunca se indexa.
export function subscriptionMetadata(locale: Locale): Metadata {
  return { title: pages[locale].subscription.metaTitle, robots: { index: false, follow: false } };
}

export function SubscriptionView({ locale, confirmar, baja }: { locale: Locale; confirmar?: string; baja?: string }) {
  const t = pages[locale].subscription;
  const action = confirmar ? "confirm" : baja ? "unsubscribe" : null;
  const token = confirmar ?? baja ?? "";
  const isValid = action !== null && typeof token === "string" && tokenPattern.test(token);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{action === "unsubscribe" ? t.titleUnsubscribe : t.titleConfirm}</h1>
        </header>
        <section className="wrap subscription-page">
          {isValid ? (
            <SubscriptionAction action={action} token={token} />
          ) : (
            <div className="subscription-box">
              <p>{t.invalid}</p>
              <Link className="button button-primary" href={localizePath(locale, "/promociones")}>{t.toPromotions}</Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
