"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsAppUrl, isWhatsAppConfigured } from "@/lib/whatsapp";

const guestOptions = ["1", "2", "3", "4", "5 (con cama extra)"];

/** Arma una consulta con fechas y personas, y la abre en WhatsApp. No reserva ni confirma disponibilidad. */
export function PromotionInquiry({ title, code }: { title: string; code?: string }) {
  const [error, setError] = useState("");

  if (!isWhatsAppConfigured) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const arrival = String(data.get("arrival"));
    const departure = String(data.get("departure"));
    const guests = String(data.get("guests"));
    const today = new Date().toLocaleDateString("en-CA");

    if (arrival < today) {
      setError("La fecha de llegada no puede ser anterior a hoy.");
      return;
    }
    if (departure <= arrival) {
      setError("La fecha de salida tiene que ser posterior a la de llegada.");
      return;
    }

    setError("");
    const url = buildWhatsAppUrl({ promotionTitle: title, promotionCode: code, arrival, departure, guests });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="promotion-inquiry" onSubmit={handleSubmit}>
      <h2>Consultá esta promoción</h2>
      <p>Elegí tus fechas y te respondemos por WhatsApp con la disponibilidad y la tarifa.</p>
      <label>
        Llegada
        <input name="arrival" required type="date" />
      </label>
      <label>
        Salida
        <input name="departure" required type="date" />
      </label>
      <label>
        Personas
        <select defaultValue="2" name="guests">
          {guestOptions.map((option) => (
            <option key={option} value={option.split(" ")[0]}>{option}</option>
          ))}
        </select>
      </label>
      {error && <p className="promotion-inquiry-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit">
        Consultar por WhatsApp <span aria-hidden="true">↗</span>
      </button>
      <small>La consulta no confirma la reserva.</small>
    </form>
  );
}
