"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AdminPromotions } from "@/components/admin-promotions";
import type { Promotion } from "@/lib/promotion";
import { formatReservationDate } from "@/lib/reservation";
import type { ReservationRecord } from "@/lib/reservations-db";
import type { ReviewRecord } from "@/lib/reviews-db";
import "./admin-panel.css";

type CabinOption = { slug: string; name: string };
type Session = { configured: boolean; loggedIn: boolean };
type AdminData = { reservations: ReservationRecord[]; reviews: ReviewRecord[]; promotions: Promotion[] };

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  approved: "Aprobada",
  rejected: "Rechazada",
};

function formatMoment(iso: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Argentina/Mendoza" }).format(new Date(iso));
}

async function sendAction(body: Record<string, unknown>) {
  const response = await fetch("/api/admin/datos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as { error?: string };
  return response.ok ? "" : (result.error ?? "No pudimos hacer el cambio.");
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    const response = await fetch("/api/admin/sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const result = (await response.json()) as { ok: boolean; error?: string };
    if (result.ok) onLogin();
    else setError(result.error ?? "No pudimos iniciar sesión.");
  }

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <h1>Panel de administración</h1>
      <label>
        Contraseña
        <input autoComplete="current-password" name="password" required type="password" />
      </label>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="button button-primary" type="submit">Entrar</button>
    </form>
  );
}

/** Panel privado para gestionar reservas y reseñas. Los datos solo se piden con la sesión iniciada. */
export function AdminPanel({ cabins }: { cabins: CabinOption[] }) {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<"reservas" | "resenas" | "promociones">("reservas");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    const response = await fetch("/api/admin/datos");
    if (response.status === 401) {
      setSession((current) => (current ? { ...current, loggedIn: false } : current));
      return;
    }
    const result = (await response.json()) as AdminData & { error?: string };
    if (response.ok) setData(result);
    else setError(result.error ?? "No pudimos leer los datos.");
  }, []);

  useEffect(() => {
    let isCurrent = true;
    fetch("/api/admin/sesion")
      .then((response) => response.json() as Promise<Session>)
      .then((result) => {
        if (!isCurrent) return;
        setSession(result);
        if (result.loggedIn) void loadData();
      });
    return () => {
      isCurrent = false;
    };
  }, [loadData]);

  async function run(body: Record<string, unknown>) {
    setError(await sendAction(body));
    await loadData();
  }

  async function logout() {
    await fetch("/api/admin/sesion", { method: "DELETE" });
    setData(null);
    setSession((current) => (current ? { ...current, loggedIn: false } : current));
  }

  async function blockDates(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    await run({ action: "block-dates", ...Object.fromEntries(new FormData(form)) });
    form.reset();
  }

  if (!session) return <p>Cargando…</p>;
  if (!session.configured) return <p className="admin-error">Falta configurar ADMIN_PASSWORD, con al menos 12 caracteres.</p>;
  if (!session.loggedIn) {
    return (
      <LoginForm
        onLogin={() => {
          setSession({ ...session, loggedIn: true });
          void loadData();
        }}
      />
    );
  }

  const cabinName = (slug: string) => cabins.find((cabin) => cabin.slug === slug)?.name ?? slug;
  const pendingReservations = data?.reservations.filter((item) => item.status === "pending").length ?? 0;
  const pendingReviews = data?.reviews.filter((item) => item.status === "pending").length ?? 0;

  return (
    <>
      <div className="admin-header">
        <h1>Panel de administración</h1>
        <button className="admin-link" onClick={logout} type="button">Cerrar sesión</button>
      </div>

      <div className="admin-tabs" role="tablist">
        <button aria-selected={tab === "reservas"} onClick={() => setTab("reservas")} role="tab" type="button">
          Reservas ({pendingReservations})
        </button>
        <button aria-selected={tab === "resenas"} onClick={() => setTab("resenas")} role="tab" type="button">
          Reseñas ({pendingReviews})
        </button>
        <button aria-selected={tab === "promociones"} onClick={() => setTab("promociones")} role="tab" type="button">
          Promociones
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {!data && !error && <p>Cargando…</p>}

      {data && tab === "reservas" && (
        <>
          <form className="admin-block" onSubmit={blockDates}>
            <h2>Bloquear fechas</h2>
            <label>
              Cabaña
              <select name="cabinSlug">
                {cabins.map((cabin) => <option key={cabin.slug} value={cabin.slug}>{cabin.name}</option>)}
              </select>
            </label>
            <label>
              Entrada
              <input name="arrival" required type="date" />
            </label>
            <label>
              Salida
              <input name="departure" required type="date" />
            </label>
            <button className="button button-primary" type="submit">Bloquear</button>
          </form>

          {data.reservations.length === 0 && <p>Todavía no hay reservas.</p>}
          <div className="admin-list">
            {data.reservations.map((item) => (
              <article className={`admin-card is-${item.status}`} key={item.id}>
                <div className="admin-card-head">
                  <h3>{cabinName(item.cabinSlug)}</h3>
                  <span className="admin-status">{statusLabels[item.status]}</span>
                </div>
                <p>
                  <strong>{formatReservationDate(item.arrival)} al {formatReservationDate(item.departure)}</strong> · {item.guests} personas
                  {item.hasBaby && " · Con bebé"}
                </p>
                {item.status === "pending" && (
                  <p className="admin-hold">
                    {item.isHolding ? `Fechas bloqueadas hasta el ${formatMoment(item.holdUntil)}` : "Bloqueo vencido: las fechas ya están libres"}
                  </p>
                )}
                <p>{item.name} · <a href={`mailto:${item.email}`}>{item.email}</a> · <a href={`tel:${item.phone}`}>{item.phone}</a></p>
                {item.message && <p className="admin-message">{item.message}</p>}
                <div className="admin-actions">
                  {item.status !== "confirmed" && (
                    <button className="button button-primary" onClick={() => run({ action: "confirm-reservation", id: item.id })} type="button">Confirmar</button>
                  )}
                  {item.status !== "rejected" && (
                    <button className="admin-link" onClick={() => run({ action: "reject-reservation", id: item.id })} type="button">
                      {item.status === "confirmed" ? "Cancelar y liberar fechas" : "Rechazar"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {data && tab === "promociones" && <AdminPromotions onChange={loadData} promotions={data.promotions} />}

      {data && tab === "resenas" && (
        <div className="admin-list">
          {data.reviews.length === 0 && <p>Todavía no hay reseñas.</p>}
          {data.reviews.map((item) => (
            <article className={`admin-card is-${item.status}`} key={item.id}>
              <div className="admin-card-head">
                <h3>{"★".repeat(item.rating)} {item.title}</h3>
                <span className="admin-status">{statusLabels[item.status]}</span>
              </div>
              <p className="admin-message">{item.quote}</p>
              <p>{item.author}</p>
              <div className="admin-actions">
                {item.status !== "approved" && (
                  <button className="button button-primary" onClick={() => run({ action: "approve-review", id: item.id })} type="button">Aprobar</button>
                )}
                {item.status !== "rejected" && (
                  <button className="admin-link" onClick={() => run({ action: "reject-review", id: item.id })} type="button">
                    {item.status === "approved" ? "Quitar de la web" : "Rechazar"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
