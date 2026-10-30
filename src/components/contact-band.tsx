import Image from "next/image";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";
import { isWhatsAppConfigured } from "@/lib/whatsapp";
import "./contact-band.css";

/** Bloque de contacto que se repite al final de las páginas principales. */
export function ContactBand() {
  return (
    <section className="wrap cta-band contact-panel">
      <div className="contact-panel-photo">
        <Image alt="" fill quality={90} sizes="(max-width: 1264px) 100vw, 1200px" src="/images/alrededor/parque.jpg" />
      </div>
      <div aria-hidden="true" className="contact-panel-shade" />
      <div>
        <p className="eyebrow">Contacto</p>
        <h2>¿Planeando una visita a Malargüe?</h2>
        <p>
          {isWhatsAppConfigured
            ? "Escribinos por WhatsApp para consultar disponibilidad, tarifas y servicios."
            : site.contactNote}
        </p>
      </div>
      {isWhatsAppConfigured ? (
        <WhatsAppButton className="button button-light">
          Escribir por WhatsApp <span aria-hidden="true">↗</span>
        </WhatsAppButton>
      ) : (
        <span className="pending-note">WhatsApp: pendiente de configurar</span>
      )}
    </section>
  );
}
