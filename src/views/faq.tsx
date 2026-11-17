import { ContactBand } from "@/components/contact-band";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/i18n/config";
import { pages } from "@/i18n/pages";
import { getFaqs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export function faqMetadata(locale: Locale) {
  const t = pages[locale].faq;
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: "/preguntas", locale });
}

export function FaqView({ locale }: { locale: Locale }) {
  const t = pages[locale].faq;
  const faqs = getFaqs(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
        </header>
        <section aria-label={t.metaTitle} className="wrap section" style={{ paddingTop: 0 }}>
          <div className="faq-list" style={{ marginTop: 0 }}>
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="faq-answer">{faq.answer}</div>
              </details>
            ))}
          </div>
        </section>
        <ContactBand locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
