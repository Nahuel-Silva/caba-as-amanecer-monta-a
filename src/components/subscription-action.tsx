"use client";

import Link from "next/link";
import { useState } from "react";
import { localizePath } from "@/i18n/config";
import { useLocale } from "@/i18n/locale-context";
import { pages } from "@/i18n/pages";
import "./promo-subscribe.css";

/**
 * Botón de la página /suscripcion. La acción se hace al tocarlo, no al abrir el enlace:
 * los antivirus del mail abren los enlaces solos y no deben confirmar ni dar de baja a nadie.
 */
export function SubscriptionAction({ action, token }: { action: "confirm" | "unsubscribe"; token: string }) {
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; text: string }>({ kind: "idle", text: "" });
  const locale = useLocale();
  const t = pages[locale].subscription;
  const text =
    action === "confirm"
      ? { intro: t.confirmIntro, button: t.confirmButton, done: t.confirmDone }
      : { intro: t.unsubscribeIntro, button: t.unsubscribeButton, done: t.unsubscribeDone };

  async function run() {
    setStatus({ kind: "sending", text: "" });
    try {
      const response = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token, locale }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      setStatus(result.ok ? { kind: "done", text: text.done } : { kind: "error", text: result.error ?? t.error });
    } catch {
      setStatus({ kind: "error", text: t.errorConnection });
    }
  }

  if (status.kind === "done") {
    return (
      <div className="subscription-box" role="status">
        <p><strong>{status.text}</strong></p>
        <Link className="button button-primary" href={localizePath(locale, "/promociones")}>{t.seePromotions}</Link>
      </div>
    );
  }

  return (
    <div className="subscription-box">
      <p>{text.intro}</p>
      {status.kind === "error" && <p className="promo-subscribe-error" role="alert">{status.text}</p>}
      <button className="button button-primary" disabled={status.kind === "sending"} onClick={run} type="button">
        {status.kind === "sending" ? t.working : text.button}
      </button>
    </div>
  );
}
