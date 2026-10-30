import type { Metadata } from "next";
import { ContactBand } from "@/components/contact-band";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getFaqs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Preguntas frecuentes",
  description: "Reservas, medios de pago, check-in y condiciones de Cabañas Amanecer de Montaña en Malargüe.",
  path: "/preguntas",
});

export default function FaqPage() {
  const faqs = getFaqs();

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Información útil</p>
          <h1>Preguntas frecuentes.</h1>
        </header>
        <section aria-label="Preguntas frecuentes" className="wrap section" style={{ paddingTop: 0 }}>
          <div className="faq-list" style={{ marginTop: 0 }}>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
        <ContactBand />
      </main>
      <SiteFooter />
    </>
  );
}
