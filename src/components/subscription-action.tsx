"use client";

import Link from "next/link";
import { useState } from "react";
import "./promo-subscribe.css";

const texts = {
  confirm: {
    intro: "Tocá el botón para confirmar que querés recibir por mail las promociones de las cabañas.",
    button: "Sí, quiero recibir promociones",
    done: "¡Listo! Confirmaste tu mail. Te vamos a avisar cuando haya una promoción nueva.",
  },
  unsubscribe: {
    intro: "Si te das de baja, borramos tu mail de la lista y no te mandamos más promociones.",
    button: "Darme de baja",
    done: "Listo, ya no vas a recibir más promociones. Borramos tu mail de la lista.",
  },
};

/**
 * Botón de la página /suscripcion. La acción se hace al tocarlo, no al abrir el enlace:
 * los antivirus del mail abren los enlaces solos y no deben confirmar ni dar de baja a nadie.
 */
export function SubscriptionAction({ action, token }: { action: "confirm" | "unsubscribe"; token: string }) {
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "done" | "error"; text: string }>({ kind: "idle", text: "" });
  const text = texts[action];

  async function run() {
    setStatus({ kind: "sending", text: "" });
    try {
      const response = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      setStatus(result.ok ? { kind: "done", text: text.done } : { kind: "error", text: result.error ?? "No pudimos hacer el cambio." });
    } catch {
      setStatus({ kind: "error", text: "No pudimos hacer el cambio. Revisá tu conexión y probá de nuevo." });
    }
  }

  if (status.kind === "done") {
    return (
      <div className="subscription-box" role="status">
        <p><strong>{status.text}</strong></p>
        <Link className="button button-primary" href="/promociones">Ver las promociones</Link>
      </div>
    );
  }

  return (
    <div className="subscription-box">
      <p>{text.intro}</p>
      {status.kind === "error" && <p className="promo-subscribe-error" role="alert">{status.text}</p>}
      <button className="button button-primary" disabled={status.kind === "sending"} onClick={run} type="button">
        {status.kind === "sending" ? "Un momento…" : text.button}
      </button>
    </div>
  );
}
