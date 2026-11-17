"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { localizePath } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { pages } from "@/i18n/pages";
import { conditionsPath } from "@/lib/subscribers";
import "./promo-subscribe.css";

/** Recuadro de la página Promociones para anotarse a los avisos por mail. La casilla viene sin marcar. */
export function PromoSubscribe() {
  const locale = useLocale();
  const t = pages[locale].subscribe;
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
          locale,
          email: fields.get("email"),
          consent: fields.get("consent") === "on",
          hp_token: fields.get("hp_token"),
        }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string; message?: string };
      setStatus(result.ok ? { kind: "done", text: t.done } : { kind: "error", text: result.error ?? t.error });
    } catch {
      setStatus({ kind: "error", text: t.errorConnection });
    }
  }

  return (
    <section aria-labelledby="promo-subscribe-title" className="promo-subscribe">
      <div>
        <h2 id="promo-subscribe-title">{t.title}</h2>
        <p>{t.text}</p>
      </div>
      {status.kind === "done" ? (
        <div className="promo-subscribe-done" role="status">
          <strong>{status.text}</strong>
          <p>{t.doneText}</p>
        </div>
      ) : (
        <form className="promo-subscribe-form" onSubmit={handleSubmit}>
          <label className="promo-subscribe-email">
            <span>{t.email}</span>
            <input autoComplete="email" maxLength={120} name="email" required type="email" />
          </label>
          <label className="promo-subscribe-consent">
            <input name="consent" required type="checkbox" />
            <span>
              {t.consent} {t.read} <Link href={localizePath(locale, conditionsPath)}>{t.conditions}</Link>.
            </span>
          </label>
          {/* Campo trampa para robots: las personas no lo ven. */}
          <div aria-hidden="true" className="reservation-trap">
            <input aria-hidden="true" autoComplete="off" data-1p-ignore data-lpignore="true" name="hp_token" tabIndex={-1} type="text" />
          </div>
          {status.kind === "error" && <p className="promo-subscribe-error" role="alert">{status.text}</p>}
          <button className="button button-primary" disabled={status.kind === "sending"} type="submit">
            {status.kind === "sending" ? t.sending : t.submit}
          </button>
        </form>
      )}
    </section>
  );
}
