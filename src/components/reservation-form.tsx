"use client";

import { useState, type FormEvent } from "react";
import { guestOptions } from "@/lib/reservation";
import "./reservation-form.css";

type ReservationFormProps = {
  cabins: string[];
  /** Cabaña elegida de entrada, si el visitante está en su página. */
  defaultCabin?: string;
  onSent: () => void;
};

/** Formulario de solicitud de reserva. Avisa al propietario por mail; no bloquea fechas. */
export function ReservationForm({ cabins, defaultCabin, onSent }: ReservationFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const result: { ok: boolean; error?: string } = await response.json();

      if (result.ok) {
        setIsSent(true);
        onSent();
      } else {
        setError(result.error ?? "No pudimos enviar tu solicitud.");
      }
    } catch {
      setError("No pudimos enviar tu solicitud. Revisá tu conexión o escribinos por WhatsApp.");
    } finally {
      setIsSending(false);
    }
  }

  if (isSent) {
    return (
      <div className="reservation-sent" role="status">
        <h3>¡Recibimos tu solicitud!</h3>
        <p>Te vamos a responder con la disponibilidad y la tarifa. Esto todavía no confirma la reserva.</p>
      </div>
    );
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
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
      <label>
        Cabaña
        <select defaultValue={defaultCabin ?? cabins[0]} name="cabin">
          {cabins.map((cabin) => (
            <option key={cabin} value={cabin}>{cabin}</option>
          ))}
        </select>
      </label>
      <label>
        Personas
        <select defaultValue="2" name="guests">
          {guestOptions.map((option) => (
            <option key={option} value={option}>{option === "5" ? "5 (con cama extra)" : option}</option>
          ))}
        </select>
      </label>
      <label>
        Llegada
        <input name="arrival" required type="date" />
      </label>
      <label>
        Salida
        <input name="departure" required type="date" />
      </label>
      <label className="reservation-wide">
        Mensaje (opcional)
        <textarea maxLength={1000} name="message" rows={3} />
      </label>

      {/* Campo trampa para robots: las personas no lo ven. */}
      <label aria-hidden="true" className="reservation-trap">
        Sitio web
        <input autoComplete="off" name="website" tabIndex={-1} type="text" />
      </label>

      {error && <p className="reservation-error reservation-wide" role="alert">{error}</p>}

      <div className="reservation-actions reservation-wide">
        <button className="button button-primary" disabled={isSending} type="submit">
          {isSending ? "Enviando…" : "Solicitar reserva"}
        </button>
        <small>Usamos tus datos solo para responder esta solicitud. No confirma la reserva.</small>
      </div>
    </form>
  );
}
