"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { conditionsPath, webConsentLabel } from "@/lib/subscribers";
import "./promo-subscribe.css";

/** Recuadro de la página Promociones para anotarse a los avisos por mail. La casilla viene sin marcar. */
export function PromoSubscribe() {
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; text: string }>({ kind: "idle", text: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setStatus({ kind: "sending", text: "" });
    try {
      const response = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          email: fields.get("email"),
          consent: fields.get("consent") === "on",
          hp_token: fields.get("hp_token"),
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; message?: string };
      setStatus(result.ok ? { kind: "done", text: result.message ?? "Listo." } : { kind: "error", text: result.error ?? "No pudimos anotarte." });
    } catch {
      setStatus({ kind: "error", text: "No pudimos anotarte. Revisá tu conexión y probá de nuevo." });
    }
  }

  return (
    <section aria-labelledby="promo-subscribe-title" className="promo-subscribe">
      <div>
        <h2 id="promo-subscribe-title">Enterate primero de las promociones.</h2>
        <p>Dejanos tu mail y te avisamos cuando haya una promoción nueva. Te podés dar de baja cuando quieras desde el mismo mail.</p>
      </div>
      {status.kind === "done" ? (
        <div className="promo-subscribe-done" role="status">
          <strong>{status.text}</strong>
          <p>Te mandamos un mail con un enlace. Hasta que no lo confirmes, no te vamos a enviar promociones. Si no lo ves, buscalo en Spam o Promociones.</p>
        </div>
      ) : (
        <form className="promo-subscribe-form" onSubmit={handleSubmit}>
          <label className="promo-subscribe-email">
            <span>Tu email</span>
            <input autoComplete="email" maxLength={120} name="email" required type="email" />
          </label>
          <label className="promo-subscribe-consent">
            <input name="consent" required type="checkbox" />
            <span>
              {webConsentLabel} Leí las <Link href={conditionsPath}>condiciones</Link>.
            </span>
          </label>
          {/* Campo trampa para robots: las personas no lo ven. */}
          <div aria-hidden="true" className="reservation-trap">
            <input aria-hidden="true" autoComplete="off" data-1p-ignore data-lpignore="true" name="hp_token" tabIndex={-1} type="text" />
          </div>
          {status.kind === "error" && <p className="promo-subscribe-error" role="alert">{status.text}</p>}
          <button className="button button-primary" disabled={status.kind === "sending"} type="submit">
            {status.kind === "sending" ? "Enviando…" : "Anotarme"}
          </button>
        </form>
      )}
    </section>
  );
}
