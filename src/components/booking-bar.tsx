"use client";

import { useState } from "react";
import { BabyToggle } from "@/components/baby-toggle";
import { DateRangePicker } from "@/components/date-range-picker";
import { StayWeather } from "@/components/stay-weather";
import { useAvailability } from "@/components/use-availability";
import { isStayAvailable, keepAvailableStay, type StaySelection } from "@/lib/availability";
import { guestOptions, openReservationEvent, type ReservationPrefill } from "@/lib/reservation";
import "./booking-bar.css";

type CabinOption = { slug: string; name: string };

/** Barra para elegir cabaña, fechas y personas. Abre el formulario de reserva con esos datos. */
export function BookingBar({ cabins }: { cabins: CabinOption[] }) {
  const availability = useAvailability();
  const [slug, setSlug] = useState(cabins[0].slug);
  const [stay, setStay] = useState<StaySelection>({ arrival: "", departure: "" });
  const [guests, setGuests] = useState("2");
  const [hasBaby, setHasBaby] = useState(false);
  const [error, setError] = useState("");

  const cabin = cabins.find((option) => option.slug === slug) ?? cabins[0];
  const bookings = availability?.bookings[slug] ?? [];

  function changeCabin(nextSlug: string) {
    setSlug(nextSlug);
    setStay(keepAvailableStay(stay, availability?.bookings[nextSlug] ?? []));
  }

  function changeStay(value: StaySelection) {
    setStay(value);
    setError("");
  }

  function openForm() {
    if (!stay.departure) {
      setError("Elegí la fecha de llegada y la de salida.");
      return;
    }
    if (!isStayAvailable(stay.arrival, stay.departure, bookings)) {
      setError("Esas fechas ya no están disponibles. Elegí otras.");
      return;
    }
    const detail: ReservationPrefill = { cabin: cabin.name, ...stay, guests, hasBaby };
    window.dispatchEvent(new CustomEvent(openReservationEvent, { detail }));
  }

  return (
    <div className="booking-bar">
      <label className="booking-field">
        Cabaña
        <select data-cabin onChange={(event) => changeCabin(event.target.value)} value={slug}>
          {cabins.map((option) => (
            <option key={option.slug} value={option.slug}>{option.name}</option>
          ))}
        </select>
      </label>

      <div className="booking-field booking-dates">
        Fechas
        {availability ? (
          <DateRangePicker
            bookings={bookings}
            notice={availability.notice}
            onChange={changeStay}
            today={availability.today}
            value={stay}
          />
        ) : (
          <div className="booking-loading">Cargando…</div>
        )}
      </div>

      <label className="booking-field">
        Personas
        <select onChange={(event) => setGuests(event.target.value)} value={guests}>
          {guestOptions.map((option) => (
            <option key={option} value={option}>{option === "5" ? "5 (con cama extra)" : option}</option>
          ))}
        </select>
      </label>

      <BabyToggle checked={hasBaby} onChange={setHasBaby} />

      <button className="button button-primary booking-submit" onClick={openForm} type="button">
        Solicitar reserva
      </button>

      {error && <p className="booking-error" role="alert">{error}</p>}

      {stay.departure && <StayWeather arrival={stay.arrival} departure={stay.departure} />}
    </div>
  );
}
