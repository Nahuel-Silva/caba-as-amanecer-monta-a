"use client";

import { useState } from "react";
import type { ConfirmRequest, Notice } from "@/components/admin-ui";
import type { SubscriberRecord } from "@/lib/subscribers";

/** "2026-11-15 20:16:07" (hora UTC de la base) -> "15 de noviembre" en hora de Mendoza. */
export function formatSubscriptionDay(value: string) {
  if (!value) return "";
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value) ? `${value.replace(" ", "T")}Z` : value;
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Mendoza" }).format(new Date(iso));
}

const hasPhone = (person: SubscriberRecord) => person.phone.replace(/\D/g, "").length >= 8;

/** Minúsculas y sin tildes: "Martín" se encuentra escribiendo "martin". */
const simplify = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca en el nombre y el mail; si se escriben números, también en el teléfono (sin espacios ni guiones). */
function matchesSearch(person: SubscriberRecord, query: string) {
  if (simplify(`${person.name} ${person.email}`).includes(query)) return true;
  const digits = query.replace(/\D/g, "");
  return digits.length >= 3 && person.phone.replace(/\D/g, "").includes(digits);
}

type AdminSubscribersProps = {
  subscribers: SubscriberRecord[];
  onChange: () => Promise<void>;
  ask: (request: ConfirmRequest) => void;
  onNotice: (notice: Notice) => void;
};

/** Lista de personas que aceptaron recibir promociones, con los teléfonos listos para la difusión de WhatsApp. */
export function AdminSubscribers({ subscribers, onChange, ask, onNotice }: AdminSubscribersProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [search, setSearch] = useState("");
  const active = subscribers.filter((person) => person.status === "active");
  const pending = subscribers.filter((person) => person.status === "pending");
  const withPhone = active.filter(hasPhone);

  const query = simplify(search);
  const matches = (person: SubscriberRecord) => !query || matchesSearch(person, query);
  const shownActive = active.filter(matches);
  const shownPending = pending.filter(matches);

  async function copyPhones() {
    const list = withPhone.map((person) => `${person.name || person.email}: ${person.phone}`).join("\n");
    try {
      await navigator.clipboard.writeText(list);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 4000);
    } catch {
      onNotice({ kind: "error", text: "No se pudo copiar. Podés copiar los teléfonos a mano desde la lista." });
    }
  }

  function remove(person: SubscriberRecord) {
    ask({
      title: "¿Sacar a esta persona de la lista?",
      text: (
        <p>
          <strong>{person.name || person.email}</strong>
          <br />
          No va a recibir más promociones por mail y se borran sus datos de la lista. Si también está en tu difusión de WhatsApp, sacala desde WhatsApp.
        </p>
      ),
      confirmLabel: "Sí, sacar de la lista",
      isDanger: true,
      onConfirm: async () => {
        try {
          const response = await fetch("/api/admin/datos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remove-subscriber", id: person.id }),
          });
          const result = (await response.json()) as { error?: string };
          onNotice(response.ok ? { kind: "success", text: "Listo, la persona salió de la lista." } : { kind: "error", text: result.error ?? "No pudimos hacer el cambio." });
        } catch {
          onNotice({ kind: "error", text: "No hay conexión a internet. Revisá la conexión y probá de nuevo." });
        }
        await onChange();
      },
    });
  }

  function personCard(person: SubscriberRecord) {
    const isPending = person.status === "pending";
    return (
      <article className={`admin-card ${isPending ? "is-pending" : "is-approved"}`} key={person.id}>
        <div className="admin-card-head">
          <h3>{person.name || person.email}</h3>
          <span className="admin-status">{isPending ? "Falta que confirme" : "Recibe promociones"}</span>
        </div>
        <p className="admin-meta">
          {person.name && <>{person.email}<br /></>}
          {hasPhone(person) && <>Teléfono: {person.phone}<br /></>}
          {person.source === "reserva" ? "Se anotó al pedir una reserva" : "Se anotó en la página Promociones"}, el {formatSubscriptionDay(person.createdAt)}.
          {isPending && " Le llegó un mail para confirmar; si no lo confirma en una semana, se borra solo."}
        </p>
        <div className="admin-actions">
          <button className="admin-link is-danger" onClick={() => remove(person)} type="button">Sacar de la lista</button>
        </div>
      </article>
    );
  }

  return (
    <section className="admin-group admin-subscribers">
      <h2>
        Personas anotadas <span className="admin-count">{active.length}</span>
      </h2>
      <p className="admin-section-intro">
        Son las personas que marcaron la casilla para recibir promociones. Les llega un mail cuando tocás &quot;Avisar por mail&quot; en una promoción.
        Si alguien te pide por WhatsApp que no le mandes más, tocá &quot;Sacar de la lista&quot; en esa persona.
      </p>

      {withPhone.length > 0 && (
        <div className="admin-whatsapp-list">
          <p>
            <strong>Para tu lista de difusión de WhatsApp:</strong> {withPhone.length} {withPhone.length === 1 ? "persona dejó" : "personas dejaron"} su teléfono al
            reservar y aceptaron recibir promociones por WhatsApp. Copiá los teléfonos y agregalos a la lista de difusión desde WhatsApp Business.
            A cada persona le llegan los mensajes solo si también tiene tu número guardado.
          </p>
          <button className="admin-button is-secondary" onClick={copyPhones} type="button">
            {isCopied ? "¡Copiados!" : "Copiar los teléfonos"}
          </button>
        </div>
      )}

      {subscribers.length > 0 && (
        <div className="admin-search">
          <label htmlFor="admin-subscriber-search">Buscar una persona</label>
          <div className="admin-search-row">
            <input
              autoComplete="off"
              id="admin-subscriber-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Escribí el nombre, el mail o el teléfono"
              type="search"
              value={search}
            />
            {search && (
              <button className="admin-button is-secondary" onClick={() => setSearch("")} type="button">
                Borrar búsqueda
              </button>
            )}
          </div>
          {query && (
            <p className="admin-search-result" role="status">
              {shownActive.length + shownPending.length === 0
                ? `No hay nadie anotado que coincida con "${search.trim()}".`
                : `${shownActive.length + shownPending.length} ${shownActive.length + shownPending.length === 1 ? "persona coincide" : "personas coinciden"} con "${search.trim()}".`}
            </p>
          )}
        </div>
      )}

      {active.length === 0 ? (
        <p className="admin-empty">Todavía no se anotó nadie.</p>
      ) : (
        shownActive.length > 0 && <div className="admin-list">{shownActive.map(personCard)}</div>
      )}

      {shownPending.length > 0 && (
        // Al buscar, la sección se abre sola para que se vea a quien coincide.
        <details className="admin-group admin-past" key={query ? "buscando" : "normal"} open={Boolean(query)} style={{ marginTop: 24 }}>
          <summary>Sin confirmar ({shownPending.length})</summary>
          <div className="admin-list">{shownPending.map(personCard)}</div>
        </details>
      )}
    </section>
  );
}
