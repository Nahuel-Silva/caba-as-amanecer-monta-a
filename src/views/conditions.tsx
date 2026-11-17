import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { intlLocale, localizePath, type Locale } from "@/i18n/config";
import { pageMetadata } from "@/lib/seo";
import { conditionsPath, consentVersion } from "@/lib/subscribers";
import { whatsappNumber } from "@/lib/whatsapp";
import "@/components/promo-subscribe.css";

/**
 * Condiciones que acepta la persona al marcar la casilla de promociones, en cada idioma.
 * Si se cambia algo de fondo, subir `consentVersion` en src/lib/subscribers.ts y cambiarlo en los tres idiomas.
 */
type ConditionsText = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  dataTitle: string;
  data: string[];
  useTitle: string;
  use: string;
  unsubscribeTitle: string;
  unsubscribe: (whatsapp: ReactNode) => ReactNode;
  rightsTitle: string;
  rights: string;
  updated: string;
  back: string;
};

const wa = (label: string) =>
  whatsappNumber ? (
    <a href={`https://wa.me/${whatsappNumber}`} rel="noopener noreferrer" target="_blank">{label}</a>
  ) : null;

const texts: Record<Locale, ConditionsText> = {
  es: {
    metaTitle: "Condiciones de los avisos de promociones",
    metaDescription: `Qué datos guarda ${site.name} para avisarte de sus promociones, para qué los usa y cómo darte de baja.`,
    eyebrow: "Avisos de promociones",
    title: "Condiciones.",
    intro: `Al marcar la casilla para recibir promociones, aceptás que ${site.name} (${site.address}, ${site.location}) guarde tus datos para avisarte de sus promociones. Es voluntario: no hace falta aceptarlo para consultar ni para reservar.`,
    dataTitle: "Qué datos guardamos",
    data: [
      "Si te anotás desde la página Promociones: tu email.",
      "Si te anotás al pedir una reserva: tu nombre, tu email y tu teléfono.",
      "La fecha en que aceptaste y la versión de estas condiciones.",
    ],
    useTitle: "Para qué los usamos",
    use: "Solo para mandarte las promociones de las cabañas: por email y, si nos dejaste tu teléfono al reservar, también por WhatsApp. Te escribimos únicamente cuando hay una promoción nueva. No vendemos ni compartimos tus datos con otras empresas para publicidad. Para enviar los mails y guardar la información usamos servicios externos (un servicio de envío de mails y el alojamiento de la web), que pueden tener sus servidores fuera de la Argentina.",
    unsubscribeTitle: "Cómo darte de baja",
    unsubscribe: (link) => (
      <>
        Cuando quieras, sin costo y sin dar explicaciones: tocá el enlace &quot;No quiero recibir más promociones&quot; al final de cualquier mail
        {link && <>, o escribinos por {link}</>}. Al darte de baja borramos tus datos de la lista. Si te llegan promociones por WhatsApp y no las
        querés más, respondé &quot;BAJA&quot;.
      </>
    ),
    rightsTitle: "Tus derechos",
    rights:
      "Podés pedir en cualquier momento ver, corregir o borrar tus datos, como establece la Ley 25.326 de Protección de los Datos Personales. El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.",
    updated: "Última actualización:",
    back: "← Volver a promociones",
  },
  pt: {
    metaTitle: "Condições dos avisos de promoções",
    metaDescription: `Quais dados ${site.name} guarda para avisar você das promoções, para que os usa e como cancelar.`,
    eyebrow: "Avisos de promoções",
    title: "Condições.",
    intro: `Ao marcar a opção para receber promoções, você aceita que ${site.name} (${site.address}, ${site.location}) guarde os seus dados para avisar você das promoções. É voluntário: não é preciso aceitar para consultar nem para reservar.`,
    dataTitle: "Quais dados guardamos",
    data: [
      "Se você se cadastrar na página Promoções: o seu e-mail.",
      "Se você se cadastrar ao pedir uma reserva: o seu nome, e-mail e telefone.",
      "A data em que você aceitou e a versão destas condições.",
    ],
    useTitle: "Para que os usamos",
    use: "Só para enviar as promoções das cabanas: por e-mail e, se você deixou o seu telefone ao reservar, também pelo WhatsApp. Escrevemos apenas quando há uma promoção nova. Não vendemos nem compartilhamos os seus dados com outras empresas para publicidade. Para enviar os e-mails e guardar as informações usamos serviços externos (um serviço de envio de e-mails e a hospedagem do site), que podem ter servidores fora da Argentina.",
    unsubscribeTitle: "Como cancelar",
    unsubscribe: (link) => (
      <>
        Quando quiser, sem custo e sem precisar explicar: toque no link para não receber mais promoções no final de qualquer e-mail
        {link && <>, ou escreva para nós pelo {link}</>}. Ao cancelar, apagamos os seus dados da lista. Se receber promoções pelo WhatsApp e não
        quiser mais, responda &quot;BAJA&quot;.
      </>
    ),
    rightsTitle: "Os seus direitos",
    rights:
      "Você pode pedir a qualquer momento para ver, corrigir ou apagar os seus dados, conforme a Lei argentina 25.326 de Proteção de Dados Pessoais. O titular dos dados pessoais pode exercer gratuitamente o direito de acesso a eles em intervalos não inferiores a seis meses, salvo se comprovar um interesse legítimo, conforme o artigo 14, inciso 3, da Lei nº 25.326. A Agência de Acesso à Informação Pública da Argentina, como Órgão de Controle da Lei nº 25.326, tem a atribuição de atender as denúncias e reclamações de quem for afetado em seus direitos pelo descumprimento das normas vigentes de proteção de dados pessoais.",
    updated: "Última atualização:",
    back: "← Voltar para as promoções",
  },
  en: {
    metaTitle: "Offer notification terms",
    metaDescription: `What data ${site.name} keeps to send you its offers, what it is used for and how to unsubscribe.`,
    eyebrow: "Offer notifications",
    title: "Terms.",
    intro: `By ticking the box to receive offers, you agree that ${site.name} (${site.address}, ${site.location}) may keep your details to let you know about its offers. It is optional: you don't need to accept it to ask questions or to book.`,
    dataTitle: "What data we keep",
    data: [
      "If you sign up on the Offers page: your email.",
      "If you sign up when requesting a booking: your name, email and phone number.",
      "The date you agreed and the version of these terms.",
    ],
    useTitle: "What we use it for",
    use: "Only to send you the cabins' offers: by email and, if you left your phone number when booking, also by WhatsApp. We only write when there's a new offer. We don't sell or share your details with other companies for advertising. To send emails and store the information we use external services (an email delivery service and the website's hosting), whose servers may be outside Argentina.",
    unsubscribeTitle: "How to unsubscribe",
    unsubscribe: (link) => (
      <>
        Whenever you like, free of charge and without giving a reason: tap the unsubscribe link at the end of any email
        {link && <>, or message us on {link}</>}. When you unsubscribe, we delete your details from the list. If you get offers on WhatsApp and no
        longer want them, reply &quot;BAJA&quot;.
      </>
    ),
    rightsTitle: "Your rights",
    rights:
      "You can ask at any time to see, correct or delete your data, as set out in Argentina's Personal Data Protection Law 25,326. Data subjects may exercise their right of access free of charge at intervals of no less than six months, unless a legitimate interest is shown, under article 14, section 3 of Law No. 25,326. Argentina's Agency for Access to Public Information, as the supervisory authority for Law No. 25,326, handles complaints and claims from anyone whose rights are affected by a breach of the data protection rules in force.",
    updated: "Last updated:",
    back: "← Back to offers",
  },
};

export function conditionsMetadata(locale: Locale) {
  const t = texts[locale];
  return pageMetadata({ title: t.metaTitle, description: t.metaDescription, path: conditionsPath, locale });
}

export function ConditionsView({ locale }: { locale: Locale }) {
  const t = texts[locale];
  const updated = new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${consentVersion}T12:00:00Z`),
  );

  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
        </header>
        <article className="wrap subscription-page">
          <p>{t.intro}</p>

          <h2>{t.dataTitle}</h2>
          <ul>
            {t.data.map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2>{t.useTitle}</h2>
          <p>{t.use}</p>

          <h2>{t.unsubscribeTitle}</h2>
          <p>{t.unsubscribe(wa("WhatsApp"))}</p>

          <h2>{t.rightsTitle}</h2>
          <p>{t.rights}</p>

          <p style={{ marginTop: 32 }}>{t.updated} {updated}.</p>
          <p>
            <Link href={localizePath(locale, "/promociones")}>{t.back}</Link>
          </p>
        </article>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
