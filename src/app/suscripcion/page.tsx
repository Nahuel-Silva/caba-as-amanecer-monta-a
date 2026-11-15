import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubscriptionAction } from "@/components/subscription-action";
import { tokenPattern } from "@/lib/subscribers";

// Página a la que llevan los enlaces de los mails. Nunca se indexa.
export const metadata: Metadata = {
  title: "Avisos de promociones",
  robots: { index: false, follow: false },
};

type SubscriptionPageProps = { searchParams: Promise<{ confirmar?: string; baja?: string }> };

export default async function SubscriptionPage({ searchParams }: SubscriptionPageProps) {
  const { confirmar, baja } = await searchParams;
  const action = confirmar ? "confirm" : baja ? "unsubscribe" : null;
  const token = confirmar ?? baja ?? "";
  const isValid = action !== null && typeof token === "string" && tokenPattern.test(token);

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Avisos de promociones</p>
          <h1>{action === "unsubscribe" ? "Darte de baja." : "Confirmá tu mail."}</h1>
        </header>
        <section className="wrap subscription-page">
          {isValid ? (
            <SubscriptionAction action={action} token={token} />
          ) : (
            <div className="subscription-box">
              <p>Este enlace no está completo. Abrilo de nuevo desde el mail o copialo entero.</p>
              <Link className="button button-primary" href="/promociones">Ir a promociones</Link>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
