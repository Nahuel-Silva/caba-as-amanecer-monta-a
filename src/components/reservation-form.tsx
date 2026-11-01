"use client";

import { useState, type FormEvent } from "react";
import { BabyToggle } from "@/components/baby-toggle";
import { DateRangePicker } from "@/components/date-range-picker";
import { useAvailability } from "@/components/use-availability";
import { keepAvailableStay, type StaySelection } from "@/lib/availability";
import { guestOptions, type ReservationPrefill } from "@/lib/reservation";
import "./reservation-form.css";

type CabinOption = { slug: string; name: string };

type ReservationFormProps = {
  cabins: CabinOption[];
  /** Datos elegidos en la barra de reserva. */
  prefill: ReservationPrefill;
  onSent: () => void;
};

/** Formulario de solicitud de reserva. Avisa al propietario por mail; no bloquea fechas. */
export function ReservationForm({ cabins, prefill, onSent }: ReservationFormProps) {
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [cabinName, setCabinName] = useState(prefill.cabin);
  const [stay, setStay] = useState<StaySelection>({ arrival: prefill.arrival, departure: prefill.departure });
  const [hasBaby, setHasBaby] = useState(prefill.hasBaby);
  const availability = useAvailability();

  const slugOf = (name: string) => cabins.find((cabin) => cabin.name === name)?.slug ?? "";
  const bookings = availability?.bookings[slugOf(cabinName)] ?? [];

  function changeCabin(name: string) {
    setCabinName(name);
    setStay(keepAvailableStay(stay, availability?.bookings[slugOf(name)] ?? []));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (!stay.departure) {
      setError("Elegí las fechas de llegada y salida.");
      return;
    }
    setError("");
    setIsSending(true);

    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ...stay, hasBaby }),
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
        <p>Bloqueamos tus fechas por 24 horas. Te vamos a responder con la tarifa, y la reserva queda confirmada con el pago de la seña.</p>
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
        <select name="cabin" onChange={(event) => changeCabin(event.target.value)} value={cabinName}>
          {cabins.map((cabin) => (
            <option key={cabin.slug} value={cabin.name}>{cabin.name}</option>
          ))}
        </select>
      </label>
      <label>
        Personas
        <select defaultValue={prefill.guests} name="guests">
          {guestOptions.map((option) => (
            <option key={option} value={option}>{option === "5" ? "5 (con cama extra)" : option}</option>
          ))}
        </select>
      </label>
      <div className="reservation-wide reservation-dates">
        <span>Fechas</span>
        {availability ? (
          <DateRangePicker
            bookings={bookings}
            notice={availability.notice}
            months={1}
            onChange={setStay}
            today={availability.today}
            value={stay}
          />
        ) : (
          <p className="reservation-loading">Cargando disponibilidad…</p>
        )}
      </div>
      <div className="reservation-wide reservation-baby">
        <BabyToggle checked={hasBaby} onChange={setHasBaby} />
      </div>
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
