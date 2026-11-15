import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { conditionsPath, consentVersion } from "@/lib/subscribers";
import { whatsappNumber } from "@/lib/whatsapp";
import "@/components/promo-subscribe.css";

export const metadata: Metadata = pageMetadata({
  title: "Condiciones de los avisos de promociones",
  description: `Qué datos guarda ${site.name} para avisarte de sus promociones, para qué los usa y cómo darte de baja.`,
  path: conditionsPath,
});

/**
 * Condiciones que acepta la persona al marcar la casilla de promociones.
 * Si se cambia algo de fondo, subir `consentVersion` en src/lib/subscribers.ts.
 */
export default function PromotionConditionsPage() {
  const updated = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${consentVersion}T12:00:00Z`));

  return (
    <>
      <SiteHeader />
      <main>
        <header className="wrap page-heading">
          <p className="eyebrow">Avisos de promociones</p>
          <h1>Condiciones.</h1>
        </header>
        <article className="wrap subscription-page">
          <p>
            Al marcar la casilla para recibir promociones, aceptás que {site.name} ({site.address}, {site.location}) guarde tus datos para
            avisarte de sus promociones. Es voluntario: no hace falta aceptarlo para consultar ni para reservar.
          </p>

          <h2>Qué datos guardamos</h2>
          <ul>
            <li>Si te anotás desde la página Promociones: tu email.</li>
            <li>Si te anotás al pedir una reserva: tu nombre, tu email y tu teléfono.</li>
            <li>La fecha en que aceptaste y la versión de estas condiciones.</li>
          </ul>

          <h2>Para qué los usamos</h2>
          <p>
            Solo para mandarte las promociones de las cabañas: por email y, si nos dejaste tu teléfono al reservar, también por WhatsApp.
            Te escribimos únicamente cuando hay una promoción nueva. No vendemos ni compartimos tus datos con otras empresas para publicidad.
            Para enviar los mails y guardar la información usamos servicios externos (un servicio de envío de mails y el alojamiento de la web),
            que pueden tener sus servidores fuera de la Argentina.
          </p>

          <h2>Cómo darte de baja</h2>
          <p>
            Cuando quieras, sin costo y sin dar explicaciones: tocá el enlace &quot;No quiero recibir más promociones&quot; al final de cualquier mail
            {whatsappNumber ? (
              <>
                , o escribinos por <a href={`https://wa.me/${whatsappNumber}`} rel="noopener noreferrer" target="_blank">WhatsApp</a>
              </>
            ) : null}
            . Al darte de baja borramos tus datos de la lista. Si te llegan promociones por WhatsApp y no las querés más, respondé &quot;BAJA&quot;.
          </p>

          <h2>Tus derechos</h2>
          <p>
            Podés pedir en cualquier momento ver, corregir o borrar tus datos, como establece la Ley 25.326 de Protección de los Datos Personales.
            El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no
            inferiores a seis meses, salvo que se acredite un interés legítimo al efecto, conforme lo establecido en el artículo 14, inciso 3 de la
            Ley N° 25.326. La Agencia de Acceso a la Información Pública, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la
            atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las
            normas vigentes en materia de protección de datos personales.
          </p>

          <p style={{ marginTop: 32 }}>Última actualización: {updated}.</p>
          <p>
            <Link href="/promociones">← Volver a promociones</Link>
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
