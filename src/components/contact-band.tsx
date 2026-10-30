import { WhatsAppButton } from "@/components/whatsapp-button";
import { site } from "@/content/site";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

/** Bloque de contacto que se repite al final de las páginas principales. */
export function ContactBand() {
  return (
    <section className="wrap cta-band">
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
        <WhatsAppButton className="button button-primary">
          Escribir por WhatsApp <span aria-hidden="true">↗</span>
        </WhatsAppButton>
      ) : (
        <span className="pending-note">WhatsApp: pendiente de configurar</span>
      )}
    </section>
  );
}
