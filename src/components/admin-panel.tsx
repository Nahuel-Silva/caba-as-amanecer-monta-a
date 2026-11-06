"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { AdminCalendar, type ManualGuestInput } from "@/components/admin-calendar";
import { AdminPromotions } from "@/components/admin-promotions";
import { ConfirmDialog, HelpBox, NoticeBar, type ConfirmRequest, type Notice } from "@/components/admin-ui";
import { amenities, site } from "@/content/site";
import { countNights, todayInMendoza, type StaySelection } from "@/lib/availability";
import { getLocation } from "@/lib/location";
import type { Promotion } from "@/lib/promotion";
import { manualBlockName } from "@/lib/reservation";
import type { ReservationRecord } from "@/lib/reservations-db";
import type { ReviewRecord } from "@/lib/reviews-db";
import "./admin-panel.css";

/*
 * Panel privado, pensado para usarse sin experiencia con computadoras:
 * letra y botones grandes, palabras simples, pasos a la vista,
 * una pregunta antes de cada cambio importante y un aviso de "Listo" después.
 */

type CabinOption = { slug: string; name: string };
type Session = { configured: boolean; loggedIn: boolean };
type AdminData = { reservations: ReservationRecord[]; reviews: ReviewRecord[]; promotions: Promotion[] };
type View = "inicio" | "reservas" | "resenas" | "promociones";
type Loaded = AdminData & { today: string; loadedAt: number };

/** "2027-01-12" -> "sábado 12 de enero de 2027" */
function formatLongDay(date: string) {
  return new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T12:00:00Z`),
  );
}

/** "2027-01-12" -> "12 de enero" */
function formatShortDay(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
}

function formatMoment(iso: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Mendoza" }).format(
    new Date(iso),
  );
}

function guestsText(guests: string, hasBaby: boolean) {
  const people = guests === "1" ? "1 persona" : `${guests} personas`;
  return hasBaby ? `${people} y un bebé` : people;
}

/** Arma el número para WhatsApp. Si no tiene código de país, se toma como un celular de Argentina. */
function whatsappNumberFor(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("54")) return digits;
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === 10 ? `549${digits}` : digits;
}

function hasPhone(item: ReservationRecord) {
  return item.phone.replace(/\D/g, "").length >= 8;
}

/** Mensajes listos para mandar por WhatsApp. Los montos quedan como $____ para completarlos antes de enviar. */
type MessageKind = "hola" | "sena" | "confirmada" | "sin-lugar";

function guestMessage(kind: MessageKind, item: ReservationRecord, cabin: string) {
  const first = item.name.split(" ")[0];
  const from = formatShortDay(item.arrival);
  const to = formatShortDay(item.departure);
  const nights = countNights(item.arrival, item.departure);
  const stay = `${nights} ${nights === 1 ? "noche" : "noches"}${item.guests !== "-" ? `, ${guestsText(item.guests, item.hasBaby)}` : ""}`;
  const schedule = amenities.find((amenity) => amenity.name === "Horarios")?.detail;
  const directions = getLocation()?.directionsUrl;

  if (kind === "sena") {
    return [
      `Hola ${first}, ¡gracias por elegirnos! Tenemos lugar en ${cabin} del ${from} al ${to} (${stay}).`,
      "",
      "La tarifa total es de $____.",
      "Para confirmar la reserva te pedimos una seña de $____, por transferencia o Mercado Pago.",
      "Datos para el pago: ____",
      "",
      "Cuando hagas la seña, mandanos el comprobante por acá. ¡Gracias!",
    ].join("\n");
  }
  if (kind === "confirmada") {
    return [
      `Hola ${first}, ¡tu reserva está confirmada! Te esperamos en ${cabin} del ${from} al ${to}.`,
      "",
      schedule ? `Horarios: ${schedule.charAt(0).toLowerCase()}${schedule.slice(1)}.` : "",
      `Dirección: ${site.address}, ${site.location}.`,
      directions ? `Cómo llegar: ${directions}` : "",
      "",
      "Cualquier consulta, escribinos por acá.",
    ]
      .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
      .join("\n");
  }
  if (kind === "sin-lugar") {
    return `Hola ${first}, gracias por escribirnos. Lamentablemente no tenemos lugar en ${cabin} del ${from} al ${to}. Si te sirven otras fechas, avisanos y lo vemos. ¡Saludos!`;
  }
  return `Hola ${first}, te escribimos de ${site.name} por tu reserva en ${cabin}, del ${from} al ${to}.`;
}

function whatsappLink(kind: MessageKind, item: ReservationRecord, cabin: string) {
  return `https://wa.me/${whatsappNumberFor(item.phone)}?text=${encodeURIComponent(guestMessage(kind, item, cabin))}`;
}

async function sendAction(body: Record<string, unknown>) {
  try {
    const response = await fetch("/api/admin/datos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { error?: string };
    return response.ok ? "" : (result.error ?? "No pudimos hacer el cambio. Probá de nuevo.");
  } catch {
    return "No hay conexión a internet. Revisá la conexión y probá de nuevo.";
  }
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get("password");
    setIsSending(true);
    try {
      const response = await fetch("/api/admin/sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (result.ok) onLogin();
      else setError(result.error ?? "La contraseña no es correcta. Revisala y probá de nuevo.");
    } catch {
      setError("No hay conexión a internet. Revisá la conexión y probá de nuevo.");
    }
    setIsSending(false);
  }

  return (
    <form className="admin-login" onSubmit={handleSubmit}>
      <h1>Panel de las cabañas</h1>
      <p>Escribí la contraseña para ver los pedidos de reserva, las opiniones y las promociones.</p>
      <label htmlFor="admin-password">Contraseña</label>
      <div className="admin-password">
        <input autoComplete="current-password" id="admin-password" name="password" required type={isVisible ? "text" : "password"} />
        <button className="admin-button is-secondary" onClick={() => setIsVisible(!isVisible)} type="button">
          {isVisible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <button className="admin-button is-primary" disabled={isSending} type="submit">
        {isSending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

function Section({ title, count, empty, children }: { title: string; count: number; empty: string; children: ReactNode }) {
  return (
    <section className="admin-group">
      <h2>
        {title} <span className="admin-count">{count}</span>
      </h2>
      {count === 0 ? <p className="admin-empty">{empty}</p> : <div className="admin-list">{children}</div>}
    </section>
  );
}

/** Panel privado para gestionar reservas, opiniones y promociones. Los datos solo se piden con la sesión iniciada. */
export function AdminPanel({ cabins }: { cabins: CabinOption[] }) {
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<Loaded | null>(null);
  const [view, setView] = useState<View>("inicio");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirmRequest, setConfirmRequest] = useState<ConfirmRequest | null>(null);
  const closeNotice = useCallback(() => setNotice(null), []);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/datos");
      if (response.status === 401) {
        setSession((current) => (current ? { ...current, loggedIn: false } : current));
        return;
      }
      const result = (await response.json()) as AdminData & { error?: string };
      if (response.ok) {
        setData({ ...result, today: todayInMendoza(), loadedAt: Date.now() });
        setLoadError("");
      } else {
        setLoadError(result.error ?? "No pudimos leer los datos.");
      }
    } catch {
      setLoadError("No hay conexión a internet. Revisá la conexión y recargá la página.");
    }
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

  /** Hace un cambio, avisa cómo salió y vuelve a leer los datos. */
  async function run(body: Record<string, unknown>, successText: string) {
    const error = await sendAction(body);
    setNotice(error ? { kind: "error", text: error } : { kind: "success", text: successText });
    await loadData();
    return !error;
  }

  function ask(request: ConfirmRequest) {
    setConfirmRequest(request);
  }

  function goTo(next: View) {
    setView(next);
    window.scrollTo({ top: 0 });
  }

  async function logout() {
    await fetch("/api/admin/sesion", { method: "DELETE" });
    setData(null);
    setView("inicio");
    setSession((current) => (current ? { ...current, loggedIn: false } : current));
  }

  if (!session) return <p className="admin-loading">Cargando…</p>;
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

  const header = (
    <div className="admin-header">
      {view === "inicio" ? (
        <h1>Panel de las cabañas</h1>
      ) : (
        <button className="admin-button is-secondary admin-back" onClick={() => goTo("inicio")} type="button">
          ← Volver al inicio
        </button>
      )}
      <button className="admin-link" onClick={logout} type="button">Salir del panel</button>
    </div>
  );

  const overlays = (
    <>
      <NoticeBar notice={notice} onClose={closeNotice} />
      <ConfirmDialog onClose={() => setConfirmRequest(null)} request={confirmRequest} />
    </>
  );

  if (!data) {
    return (
      <>
        {header}
        {loadError ? <p className="admin-error" role="alert">{loadError}</p> : <p className="admin-loading">Cargando…</p>}
      </>
    );
  }

  const { today } = data;
  const isManualBlock = (item: ReservationRecord) => item.name === manualBlockName;
  const toAnswer = data.reservations.filter((item) => item.status === "pending");
  const upcoming = data.reservations
    .filter((item) => item.status === "confirmed" && item.departure >= today)
    .sort((a, b) => a.arrival.localeCompare(b.arrival));
  const past = data.reservations.filter((item) => item.status === "rejected" || (item.status === "confirmed" && item.departure < today));
  const reviewsToCheck = data.reviews.filter((item) => item.status === "pending");
  const publishedReviews = data.reviews.filter((item) => item.status === "approved");
  const hiddenReviews = data.reviews.filter((item) => item.status === "rejected");
  const visiblePromotions = data.promotions.filter((item) => item.active).length;

  /* ---------- Inicio ---------- */

  if (view === "inicio") {
    const pendingTotal = toAnswer.length + reviewsToCheck.length;
    const summary =
      pendingTotal === 0
        ? "No hay nada pendiente. Todo está al día."
        : [
            toAnswer.length > 0 && `${toAnswer.length} ${toAnswer.length === 1 ? "pedido de reserva" : "pedidos de reserva"} para responder`,
            reviewsToCheck.length > 0 && `${reviewsToCheck.length} ${reviewsToCheck.length === 1 ? "opinión" : "opiniones"} para revisar`,
          ]
            .filter(Boolean)
            .join(" y ");

    const tiles: { view: View; title: string; text: string; count: number; isUrgent: boolean }[] = [
      { view: "reservas", title: "Pedidos de reserva", text: "Responder pedidos, ver las próximas estadías y bloquear fechas.", count: toAnswer.length, isUrgent: toAnswer.length > 0 },
      { view: "resenas", title: "Opiniones", text: "Revisar las opiniones que dejan los huéspedes en la web.", count: reviewsToCheck.length, isUrgent: reviewsToCheck.length > 0 },
      { view: "promociones", title: "Promociones", text: `Crear, cambiar u ocultar promociones. Hay ${visiblePromotions} ${visiblePromotions === 1 ? "visible" : "visibles"} en la web.`, count: 0, isUrgent: false },
    ];

    return (
      <>
        {header}
        {overlays}
        <div className={`admin-summary ${pendingTotal > 0 ? "is-pending" : "is-clear"}`}>
          <p className="admin-summary-label">{pendingTotal > 0 ? "Tenés" : "Todo listo"}</p>
          <p className="admin-summary-text">{summary}{pendingTotal > 0 && "."}</p>
          {upcoming.filter((item) => !isManualBlock(item)).length > 0 && (
            <p className="admin-summary-next">
              Próxima llegada: {cabinName(upcoming.find((item) => !isManualBlock(item))!.cabinSlug)}, el {formatLongDay(upcoming.find((item) => !isManualBlock(item))!.arrival)}.
            </p>
          )}
        </div>

        <p className="admin-intro">¿Qué querés hacer?</p>
        <div className="admin-tiles">
          {tiles.map((tile) => (
            <button className={`admin-tile ${tile.isUrgent ? "is-urgent" : ""}`} key={tile.view} onClick={() => goTo(tile.view)} type="button">
              <span className="admin-tile-title">
                {tile.title}
                {tile.count > 0 && <span className="admin-badge">{tile.count} {tile.count === 1 ? "nuevo" : "nuevos"}</span>}
              </span>
              <span className="admin-tile-text">{tile.text}</span>
              <span aria-hidden="true" className="admin-tile-arrow">→</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  /* ---------- Pedidos de reserva ---------- */

  if (view === "reservas") {
    function confirmReservation(item: ReservationRecord) {
      ask({
        title: "¿Confirmar esta reserva?",
        text: (
          <p>
            <strong>{item.name}</strong> en <strong>{cabinName(item.cabinSlug)}</strong>, del {formatLongDay(item.arrival)} al {formatLongDay(item.departure)}.
            <br />
            Las fechas quedan ocupadas en la web hasta que la canceles.
          </p>
        ),
        confirmLabel: "Sí, confirmar reserva",
        onConfirm: async () => {
          await run({ action: "confirm-reservation", id: item.id }, `Listo, la reserva de ${item.name} quedó confirmada. Ahora mandale la confirmación con el botón verde.`);
        },
      });
    }

    function cancelReservation(item: ReservationRecord) {
      const isBlock = isManualBlock(item);
      const isConfirmed = item.status === "confirmed";
      ask({
        title: isBlock ? "¿Liberar estas fechas?" : isConfirmed ? "¿Cancelar esta reserva?" : "¿Rechazar este pedido?",
        text: (
          <p>
            {isBlock ? "Fechas bloqueadas" : <strong>{item.name}</strong>} en <strong>{cabinName(item.cabinSlug)}</strong>, del {formatLongDay(item.arrival)} al {formatLongDay(item.departure)}.
            <br />
            Las fechas vuelven a quedar libres en la web.{!isBlock && " La web no le avisa a la persona: escribile vos para contarle."}
          </p>
        ),
        confirmLabel: isBlock ? "Sí, liberar fechas" : isConfirmed ? "Sí, cancelar reserva" : "Sí, rechazar pedido",
        isDanger: true,
        onConfirm: async () => {
          await run(
            { action: "reject-reservation", id: item.id },
            isBlock ? "Listo, las fechas quedaron libres." : isConfirmed ? "Listo, la reserva quedó cancelada y las fechas libres." : "Listo, el pedido quedó rechazado.",
          );
        },
      });
    }

    function blockDates(cabin: CabinOption, stay: StaySelection, guest: ManualGuestInput | null, clear: () => void) {
      ask({
        title: guest ? "¿Anotar esta reserva?" : "¿Bloquear estas fechas?",
        text: (
          <p>
            {guest && (
              <>
                <strong>{guest.name}</strong>
                {guest.phone && ` · Teléfono ${guest.phone}`} · {guestsText(guest.guests, false)}
                <br />
              </>
            )}
            <strong>{cabin.name}</strong>, del {formatLongDay(stay.arrival)} al {formatLongDay(stay.departure)}.
            <br />
            {guest
              ? "Queda como reserva confirmada. Si te equivocás, después podés cancelarla."
              : "Nadie va a poder pedir esos días desde la web. Si te equivocás, después podés liberarlos."}
          </p>
        ),
        confirmLabel: guest ? "Sí, anotar reserva" : "Sí, bloquear fechas",
        onConfirm: async () => {
          const ok = await run(
            { action: "block-dates", cabinSlug: cabin.slug, ...stay, ...guest },
            guest ? `Listo, la reserva de ${guest.name} quedó anotada.` : "Listo, las fechas quedaron bloqueadas.",
          );
          if (ok) clear();
        },
      });
    }

    function reservationCard(item: ReservationRecord) {
      const nights = countNights(item.arrival, item.departure);
      const cabin = cabinName(item.cabinSlug);
      const hoursLeft = Math.max(0, Math.ceil((Date.parse(item.holdUntil) - data!.loadedAt) / 3_600_000));

      if (isManualBlock(item)) {
        return (
          <article className="admin-card is-block" key={item.id}>
            <div className="admin-card-head">
              <h3>{cabin}</h3>
              <span className="admin-status">Bloqueadas a mano</span>
            </div>
            <p className="admin-dates">Del {formatLongDay(item.arrival)} al {formatLongDay(item.departure)} · {nights} {nights === 1 ? "noche" : "noches"}</p>
            <div className="admin-actions">
              {item.status === "confirmed" && (
                <button className="admin-button is-secondary" onClick={() => cancelReservation(item)} type="button">Liberar estas fechas</button>
              )}
            </div>
          </article>
        );
      }

      const isManualEntry = item.email === "-";
      const canMessage = hasPhone(item);

      return (
        <article className={`admin-card is-${item.status}`} key={item.id}>
          <div className="admin-card-head">
            <h3>{item.name}</h3>
            <span className="admin-status">
              {item.status === "pending" ? "Para responder" : item.status === "confirmed" ? (isManualEntry ? "Anotada a mano" : "Confirmada") : "Rechazada o cancelada"}
            </span>
          </div>
          <p className="admin-dates">
            <strong>{cabin}</strong>{item.guests !== "-" && <> · {guestsText(item.guests, item.hasBaby)}</>}
            <br />
            Llega el {formatLongDay(item.arrival)}
            <br />
            Se va el {formatLongDay(item.departure)} · {nights} {nights === 1 ? "noche" : "noches"}
          </p>
          {item.message && <p className="admin-message">“{item.message}”</p>}
          <p className="admin-meta">
            {isManualEntry ? "Anotada" : "Pidió"} el {formatMoment(item.createdAt)}
            {canMessage && ` · Teléfono ${item.phone}`}
            {!isManualEntry && ` · ${item.email}`}
          </p>

          {item.status === "pending" && (
            <>
              <p className={`admin-hold ${item.isHolding ? "" : "is-expired"}`}>
                {item.isHolding
                  ? `Las fechas quedan apartadas ${hoursLeft <= 1 ? "menos de 1 hora" : `${hoursLeft} horas`} más. Después se liberan solas.`
                  : "Pasaron 24 horas: las fechas ya se liberaron y otra persona las puede pedir."}
              </p>
              <ol className="admin-steps">
                <li>
                  <span>Mandale la tarifa y los datos para la seña.</span>
                  <span className="admin-contact">
                    <a className="admin-button is-whatsapp" href={whatsappLink("sena", item, cabin)} rel="noopener noreferrer" target="_blank">Mandar mensaje de la seña</a>
                    <a className="admin-button is-secondary" href={`tel:${item.phone}`}>Llamar</a>
                  </span>
                  <small className="admin-hint">Se abre WhatsApp con el mensaje ya escrito. Antes de enviarlo, completá donde dice $____ y los datos para el pago.</small>
                </li>
                <li>
                  <span>Cuando pague la seña, confirmá la reserva.</span>
                  <span className="admin-contact">
                    <button className="admin-button is-primary" onClick={() => confirmReservation(item)} type="button">Confirmar reserva</button>
                  </span>
                </li>
                <li>
                  <span>Después, mandale la confirmación con la dirección.</span>
                  <small className="admin-hint">El botón aparece en cuanto confirmes la reserva.</small>
                </li>
              </ol>
              <div className="admin-decline">
                <p>¿No hay lugar o no va a venir?</p>
                <div className="admin-actions">
                  <a className="admin-button is-secondary" href={whatsappLink("sin-lugar", item, cabin)} rel="noopener noreferrer" target="_blank">Avisarle que no hay lugar</a>
                  <button className="admin-link is-danger" onClick={() => cancelReservation(item)} type="button">Rechazar pedido</button>
                </div>
              </div>
            </>
          )}

          {item.status === "confirmed" && item.departure >= today && (
            <div className="admin-actions">
              {canMessage && (
                <>
                  <a className="admin-button is-whatsapp" href={whatsappLink("confirmada", item, cabin)} rel="noopener noreferrer" target="_blank">Mandar confirmación y dirección</a>
                  <a className="admin-button is-secondary" href={whatsappLink("hola", item, cabin)} rel="noopener noreferrer" target="_blank">Escribir otro mensaje</a>
                </>
              )}
              <button className="admin-link is-danger" onClick={() => cancelReservation(item)} type="button">Cancelar reserva</button>
            </div>
          )}
        </article>
      );
    }

    return (
      <>
        {header}
        {overlays}
        <h1 className="admin-title">Pedidos de reserva</h1>
        <HelpBox>
          <p>Acá aparecen las personas que pidieron reservar desde la web. Cada pedido aparta las fechas por 24 horas.</p>
          <p>Para cada pedido: <strong>1.</strong> mandale el mensaje de la seña, <strong>2.</strong> cuando pague, tocá <strong>Confirmar reserva</strong>, <strong>3.</strong> mandale la confirmación con la dirección.</p>
          <p>Los botones verdes abren WhatsApp con el mensaje ya escrito: lo revisás y lo enviás.</p>
        </HelpBox>

        <Section count={toAnswer.length} empty="No hay pedidos nuevos." title="Para responder">
          {toAnswer.map((item) => reservationCard(item))}
        </Section>

        <Section count={upcoming.length} empty="No hay estadías confirmadas por delante." title="Próximas estadías">
          {upcoming.map((item) => reservationCard(item))}
        </Section>

        <section className="admin-group">
          <h2>Calendario: anotar reservas y bloquear fechas</h2>
          <p className="admin-section-intro">Usalo cuando alguien reserva por teléfono o por otra página (anotás sus datos), o cuando una cabaña no se puede usar (solo bloqueás los días). Esos días dejan de aparecer libres en la web.</p>
          <AdminCalendar cabins={cabins} formatDay={formatLongDay} onBlock={blockDates} reservations={data.reservations} today={today} />
        </section>

        <details className="admin-group admin-past">
          <summary>Anteriores, rechazadas y canceladas ({past.length})</summary>
          {past.length === 0 ? <p className="admin-empty">Todavía no hay.</p> : <div className="admin-list">{past.map((item) => reservationCard(item))}</div>}
        </details>
      </>
    );
  }

  /* ---------- Opiniones ---------- */

  if (view === "resenas") {
    function publish(item: ReviewRecord) {
      ask({
        title: "¿Publicar esta opinión en la web?",
        text: <p>La opinión de <strong>{item.author}</strong> va a aparecer en la sección de opiniones del inicio.</p>,
        confirmLabel: "Sí, publicar",
        onConfirm: async () => {
          await run({ action: "approve-review", id: item.id }, "Listo, la opinión ya se ve en la web.");
        },
      });
    }

    function hide(item: ReviewRecord) {
      const isPublished = item.status === "approved";
      ask({
        title: isPublished ? "¿Sacar esta opinión de la web?" : "¿No publicar esta opinión?",
        text: <p>La opinión de <strong>{item.author}</strong> no se va a ver en la web. Podés volver a publicarla cuando quieras.</p>,
        confirmLabel: isPublished ? "Sí, sacarla" : "Sí, no publicar",
        isDanger: true,
        onConfirm: async () => {
          await run({ action: "reject-review", id: item.id }, isPublished ? "Listo, la opinión ya no se ve en la web." : "Listo, la opinión no se va a publicar.");
        },
      });
    }

    function reviewCard(item: ReviewRecord) {
      return (
        <article className={`admin-card is-${item.status}`} key={item.id}>
          <div className="admin-card-head">
            <h3>{item.title}</h3>
            <span className="admin-status">{item.status === "pending" ? "Para revisar" : item.status === "approved" ? "Publicada" : "No publicada"}</span>
          </div>
          <p className="admin-stars" aria-label={`${item.rating} de 5 estrellas`}>
            {"★".repeat(item.rating)}
            <span>{"★".repeat(5 - item.rating)}</span>
          </p>
          <p className="admin-message">“{item.quote}”</p>
          <p className="admin-meta">{item.author} · {formatMoment(item.createdAt)}</p>
          <div className="admin-actions">
            {item.status !== "approved" && <button className="admin-button is-primary" onClick={() => publish(item)} type="button">Publicar en la web</button>}
            {item.status !== "rejected" && (
              <button className="admin-link" onClick={() => hide(item)} type="button">{item.status === "approved" ? "Sacar de la web" : "No publicar"}</button>
            )}
          </div>
        </article>
      );
    }

    return (
      <>
        {header}
        {overlays}
        <h1 className="admin-title">Opiniones</h1>
        <HelpBox>
          <p>Las opiniones que dejan los huéspedes en la web se publican solas. Solo llegan acá para revisar las que tienen insultos o enlaces.</p>
          <p>Si una opinión publicada no te parece bien, podés sacarla de la web.</p>
        </HelpBox>

        <Section count={reviewsToCheck.length} empty="No hay opiniones para revisar." title="Para revisar">
          {reviewsToCheck.map((item) => reviewCard(item))}
        </Section>
        <Section count={publishedReviews.length} empty="Todavía no hay opiniones publicadas desde la web." title="Publicadas en la web">
          {publishedReviews.map((item) => reviewCard(item))}
        </Section>
        <details className="admin-group admin-past">
          <summary>No publicadas ({hiddenReviews.length})</summary>
          {hiddenReviews.length === 0 ? <p className="admin-empty">Todavía no hay.</p> : <div className="admin-list">{hiddenReviews.map((item) => reviewCard(item))}</div>}
        </details>
      </>
    );
  }

  /* ---------- Promociones ---------- */

  return (
    <>
      {header}
      {overlays}
      <h1 className="admin-title">Promociones</h1>
      <HelpBox>
        <p>Las promociones aparecen en la página Promociones de la web. Podés crear una nueva, cambiar una que ya existe u ocultarla sin borrarla.</p>
      </HelpBox>
      <AdminPromotions ask={ask} onChange={loadData} onNotice={setNotice} promotions={data.promotions} />
    </>
  );
}
