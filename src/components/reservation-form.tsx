"use client";

import { useState, type FormEvent } from "react";
import { StayWeather } from "@/components/stay-weather";
import Link from "next/link";
import { localizePath } from "@/i18n/config";
import { formatDay } from "@/i18n/format";
import { useLocale, useUi } from "@/i18n/locale-context";
import { countNights } from "@/lib/availability";
import type { ReservationPrefill } from "@/lib/reservation";
import { conditionsPath } from "@/lib/subscribers";
import "./reservation-form.css";
import "./promo-subscribe.css";

type ReservationFormProps = {
  /** Datos elegidos en la barra de reserva. */
  prefill: ReservationPrefill;
  /** Vuelve a la barra de reserva para cambiar esos datos. */
  onEdit: () => void;
  onSent: () => void;
};

/** Pide los datos de contacto para la estadía elegida en la barra. El servidor bloquea las fechas por 24 horas. */
export function ReservationForm({ prefill, onEdit, onSent }: ReservationFormProps) {
  const locale = useLocale();
  const ui = useUi();
  const t = ui.reservation;
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
        body: JSON.stringify({ ...fields, wantsPromotions: fields.wantsPromotions === "on", ...prefill, locale }),
      });
      const result: { ok: boolean; error?: string } = await response.json();

      if (result.ok) {
        setIsSent(true);
        onSent();
      } else {
        setFailure({ message: result.error ?? t.errorFallback, prefill });
      }
    } catch {
      setFailure({ message: t.errorConnection, prefill });
    } finally {
      setIsSending(false);
    }
  }

  if (isSent) {
    return (
      <div className="reservation-sent" role="status">
        <h3>{t.sentTitle}</h3>
        <p>{t.sentText}</p>
      </div>
    );
  }

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="reservation-summary reservation-wide">
        <div>
          <strong>{prefill.cabin}</strong>
          <p>{formatDay(prefill.arrival, locale)} → {formatDay(prefill.departure, locale)} · {ui.calendar.nights(nights)}</p>
          <p>{t.guests(prefill.guests)}{prefill.hasBaby && t.withBaby}</p>
        </div>
        <button className="reservation-summary-edit" onClick={onEdit} type="button">{t.change}</button>
      </div>
      <div className="reservation-wide">
        <StayWeather arrival={prefill.arrival} departure={prefill.departure} />
      </div>
      <label className="reservation-wide">
        {t.name}
        <input autoComplete="name" maxLength={80} name="name" required type="text" />
      </label>
      <label>
        {t.email}
        <input autoComplete="email" maxLength={120} name="email" required type="email" />
      </label>
      <label>
        {t.phone}
        <input autoComplete="tel" maxLength={30} name="phone" required type="tel" />
      </label>
      <label className="reservation-wide">
        {t.message}
        <textarea maxLength={1000} name="message" rows={3} />
      </label>
      {/* Opcional y sin marcar: no hace falta para reservar. */}
      <label className="reservation-wide reservation-consent">
        <input name="wantsPromotions" type="checkbox" />
        <span>
          {t.consent} {t.optional}{" "}
          <Link href={localizePath(locale, conditionsPath)} target="_blank">{t.conditions}</Link>
        </span>
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
          {isSending ? t.sending : t.submit}
        </button>
        <small>{t.note}</small>
      </div>
    </form>
  );
}
