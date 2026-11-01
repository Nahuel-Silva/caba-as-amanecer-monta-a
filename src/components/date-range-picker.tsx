"use client";

import { useEffect, useRef, useState } from "react";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { countNights, selectDay, type Booking, type StaySelection } from "@/lib/availability";
import "./availability-calendar.css";

type DateRangePickerProps = {
  bookings: Booking[];
  today: string;
  value: StaySelection;
  onChange: (value: StaySelection) => void;
  /** Meses visibles a la vez. */
  months?: number;
  /** Aviso cuando las fechas no se pudieron verificar. */
  notice?: string;
};

function formatDay(day: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

/** Selector de fechas: dos campos que despliegan el calendario para marcar llegada y salida. */
export function DateRangePicker({ bookings, today, value, onChange, months = 2, notice }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { arrival, departure } = value;
  const nights = departure ? countNights(arrival, departure) : 0;

  useEffect(() => {
    if (!isOpen) return;

    function closeOnOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <div className="date-range" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Elegir fechas de llegada y salida"
        className={`date-range-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
        type="button"
      >
        <span className={!departure && isOpen ? "is-active" : undefined}>
          <small>Llegada</small>
          <strong>{arrival ? formatDay(arrival) : "Elegir fecha"}</strong>
        </span>
        <span aria-hidden="true" className="date-range-arrow">→</span>
        <span>
          <small>Salida</small>
          <strong>{departure ? formatDay(departure) : "Elegir fecha"}</strong>
        </span>
      </button>

      {isOpen && (
        <div className="date-range-popover">
          <AvailabilityCalendar
            bookings={bookings}
            months={months}
            onSelectDay={(day) => onChange(selectDay(day, value))}
            selection={value}
            today={today}
          />
          <div className="date-range-footer">
            <div className="date-range-legend">
              <span><i className="date-range-swatch is-free" /> Disponible</span>
              <span><i className="date-range-swatch is-booked" /> No disponible</span>
              {notice && <em>{notice}</em>}
            </div>
            <div className="date-range-actions">
              {nights > 0 && <strong>{nights} {nights === 1 ? "noche" : "noches"}</strong>}
              <button className="date-range-clear" disabled={!arrival} onClick={() => onChange({ arrival: "", departure: "" })} type="button">
                Limpiar
              </button>
              <button className="button button-primary date-range-done" onClick={() => setIsOpen(false)} type="button">
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
