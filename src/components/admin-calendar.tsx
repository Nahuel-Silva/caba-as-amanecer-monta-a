"use client";

import { useState, type FormEvent } from "react";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { countNights, selectDay, type Booking, type StaySelection } from "@/lib/availability";
import { guestOptions } from "@/lib/reservation";
import type { ReservationRecord } from "@/lib/reservations-db";
import "./availability-calendar.css";

type CabinOption = { slug: string; name: string };

/** Datos de un huésped que reservó por teléfono o por otra página. */
export type ManualGuestInput = { name: string; phone: string; guests: string };

type AdminCalendarProps = {
  cabins: CabinOption[];
  reservations: ReservationRecord[];
  today: string;
  formatDay: (date: string) => string;
  /** Pide confirmación y guarda. `guest` es null cuando solo se bloquean los días. Si sale bien, llama a `clear`. */
  onBlock: (cabin: CabinOption, stay: StaySelection, guest: ManualGuestInput | null, clear: () => void) => void;
};

type Mode = "reserva" | "bloqueo";

const emptyStay: StaySelection = { arrival: "", departure: "" };

/** Días ocupados de cada cabaña. Tocando el calendario se anota una reserva o se bloquean días. */
export function AdminCalendar({ cabins, reservations, today, formatDay, onBlock }: AdminCalendarProps) {
  const [cabinSlug, setCabinSlug] = useState(cabins[0].slug);
  const [stay, setStay] = useState<StaySelection>(emptyStay);
  const [mode, setMode] = useState<Mode>("reserva");
  const [formKey, setFormKey] = useState(0);
  const cabin = cabins.find((option) => option.slug === cabinSlug) ?? cabins[0];

  // Ocupan días las reservas confirmadas (también los bloqueos) y los pedidos que todavía apartan fechas.
  const bookings: Booking[] = reservations
    .filter((item) => item.cabinSlug === cabinSlug && (item.status === "confirmed" || (item.status === "pending" && item.isHolding)))
    .map((item) => ({ from: item.arrival, to: item.departure }));

  const nights = stay.departure ? countNights(stay.arrival, stay.departure) : 0;

  function clear() {
    setStay(emptyStay);
    setFormKey((key) => key + 1);
  }

  function chooseCabin(slug: string) {
    setCabinSlug(slug);
    setStay(emptyStay);
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "bloqueo") {
      onBlock(cabin, stay, null, clear);
      return;
    }
    const fields = new FormData(event.currentTarget);
    const read = (name: string) => String(fields.get(name) ?? "").trim();
    onBlock(cabin, stay, { name: read("guestName"), phone: read("guestPhone"), guests: read("guestCount") }, clear);
  }

  return (
    <div className="admin-calendar">
      <p className="admin-calendar-intro">
        <strong>1.</strong> Elegí la cabaña. Los días <span className="admin-calendar-busy">tachados</span> ya están ocupados.
        <br />
        <strong>2.</strong> Tocá el día de llegada y después el día de salida.
      </p>

      <div aria-label="Cabaña" className="admin-cabin-switch" role="group">
        {cabins.map((option) => (
          <button aria-pressed={option.slug === cabinSlug} className="admin-button is-secondary" key={option.slug} onClick={() => chooseCabin(option.slug)} type="button">
            {option.name}
          </button>
        ))}
      </div>

      <div className="admin-calendar-box">
        <AvailabilityCalendar
          bookings={bookings}
          key={cabinSlug}
          months={2}
          onSelectDay={(day) => setStay(selectDay(day, stay))}
          selection={stay}
          today={today}
        />
      </div>

      <div aria-live="polite" className="admin-calendar-choice">
        {!stay.arrival && <p>Todavía no elegiste días.</p>}
        {stay.arrival && !stay.departure && (
          <p>
            Llegada: <strong>{formatDay(stay.arrival)}</strong>. Ahora tocá el día de salida.
          </p>
        )}
        {stay.departure && (
          <form className="admin-calendar-form" key={formKey} onSubmit={save}>
            <p>
              <strong>{cabin.name}</strong>: del {formatDay(stay.arrival)} al {formatDay(stay.departure)} · {nights} {nights === 1 ? "noche" : "noches"}.
            </p>

            <p className="admin-calendar-step"><strong>3.</strong> ¿Qué querés hacer con esos días?</p>
            <div aria-label="Qué hacer con esos días" className="admin-cabin-switch" role="group">
              <button aria-pressed={mode === "reserva"} className="admin-button is-secondary" onClick={() => setMode("reserva")} type="button">
                Anotar una reserva
              </button>
              <button aria-pressed={mode === "bloqueo"} className="admin-button is-secondary" onClick={() => setMode("bloqueo")} type="button">
                Solo bloquear los días
              </button>
            </div>

            {mode === "reserva" ? (
              <div className="admin-guest-fields">
                <p className="admin-hint">Para una persona que reservó por teléfono o por otra página. Queda como reserva confirmada.</p>
                <label>
                  Nombre de quien reserva
                  <input autoComplete="off" maxLength={80} name="guestName" required type="text" />
                </label>
                <label>
                  Teléfono (opcional)
                  <input autoComplete="off" inputMode="tel" maxLength={30} name="guestPhone" type="tel" />
                  <small className="admin-hint">Con el teléfono, después le podés mandar la confirmación por WhatsApp.</small>
                </label>
                <label>
                  Cantidad de personas
                  <select defaultValue="2" name="guestCount">
                    {guestOptions.map((option) => (
                      <option key={option} value={option}>{option === "5" ? "5 (con cama extra)" : option}</option>
                    ))}
                  </select>
                </label>
              </div>
            ) : (
              <p className="admin-hint">Para cuando una cabaña no se puede usar, por ejemplo por arreglos. No se anotan datos de huéspedes.</p>
            )}

            <div className="admin-actions">
              <button className="admin-button is-primary" type="submit">{mode === "reserva" ? "Anotar reserva" : "Bloquear estos días"}</button>
              <button className="admin-link" onClick={clear} type="button">Elegir otros días</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
