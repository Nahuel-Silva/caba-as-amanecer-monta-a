"use client";

import { useState, type FormEvent } from "react";
import { countNights, formatDay } from "@/lib/availability";
import type { ReservationPrefill } from "@/lib/reservation";
import "./reservation-form.css";

type ReservationFormProps = {
  /** Datos elegidos en la barra de reserva. */
  prefill: ReservationPrefill;
  /** Vuelve a la barra de reserva para cambiar esos datos. */
  onEdit: () => void;
  onSent: () => void;
};

function guestsLabel(guests: string) {
  if (guests === "5") return "5 personas (con cama extra)";
  return `${guests} ${guests === "1" ? "persona" : "personas"}`;
}

/** Pide los datos de contacto para la estadía elegida en la barra. El servidor bloquea las fechas por 24 horas. */
export function ReservationForm({ prefill, onEdit, onSent }: ReservationFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [failure, setFailure] = useState<{ message: string; prefill: ReservationPrefill } | null>(null);

  // Un error vale para los datos con los que se envió: desaparece al volver de la barra.
  const error = failure?.prefill === prefill ? failure.message : "";
  const nights = countNights(prefill.arrival, prefill.departure);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setFailure(null);
    setIsSending(true);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ...prefill }),
      });
      const result: { ok: boolean; error?: string } = await response.json();

      if (result.ok) {
        setIsSent(true);
        onSent();
      } else {
        setFailure({ message: result.error ?? "No pudimos enviar tu solicitud.", prefill });
      }
    } catch {
      setFailure({ message: "No pudimos enviar tu solicitud. Revisá tu conexión o escribinos por WhatsApp.", prefill });
    } finally {
      setIsSending(false);
    }
  }

  if (isSent) {
    return (
      <div className="reservation-sent" role="status">
        <h3>¡Recibimos tu solicitud!</h3>
        <p>Bloqueamos tus fechas por 24 horas. Te vamos a responder con la tarifa, y la reserva queda confirmada con el pago de la seña.</p>
      </div>
    );
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="reservation-summary reservation-wide">
        <div>
          <strong>{prefill.cabin}</strong>
          <p>{formatDay(prefill.arrival)} → {formatDay(prefill.departure)} · {nights} {nights === 1 ? "noche" : "noches"}</p>
          <p>{guestsLabel(prefill.guests)}{prefill.hasBaby && " · Con bebé"}</p>
        </div>
        <button className="reservation-summary-edit" onClick={onEdit} type="button">Cambiar</button>
      </div>
      <label className="reservation-wide">
        Nombre y apellido
        <input autoComplete="name" maxLength={80} name="name" required type="text" />
      </label>
      <label>
        Email
        <input autoComplete="email" maxLength={120} name="email" required type="email" />
      </label>
      <label>
        Teléfono
        <input autoComplete="tel" maxLength={30} name="phone" required type="tel" />
      </label>
      <label className="reservation-wide">
        Mensaje (opcional)
        <textarea maxLength={1000} name="message" rows={3} />
      </label>

      {/* Campo trampa para robots: las personas no lo ven. Sin "sitio web" ni nada que el navegador autocomplete. */}
      <div aria-hidden="true" className="reservation-trap">
        <input
          aria-hidden="true"
          autoComplete="off"
          data-1p-ignore
          data-bwignore
          data-form-type="other"
          data-lpignore="true"
          name="hp_token"
          tabIndex={-1}
          type="text"
        />
      </div>

      {error && <p className="reservation-error reservation-wide" role="alert">{error}</p>}

      <div className="reservation-actions reservation-wide">
        <button className="button button-primary" disabled={isSending} type="submit">
          {isSending ? "Enviando…" : "Solicitar reserva"}
        </button>
        <small>Usamos tus datos solo para responder esta solicitud. Las fechas se bloquean por 24 horas y se liberan si no se confirma.</small>
      </div>
    </form>
  );
}
