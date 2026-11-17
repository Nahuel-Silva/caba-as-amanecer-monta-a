"use client";

import { useEffect, useRef, useState } from "react";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import { formatDay } from "@/i18n/format";
import { useLocale, useUi } from "@/i18n/locale-context";
import { countNights, selectDay, type Booking, type StaySelection } from "@/lib/availability";
import "./availability-calendar.css";

type DateRangePickerProps = {
  bookings: Booking[];
  today: string;
  value: StaySelection;
  onChange: (value: StaySelection) => void;
  /** Aviso cuando las fechas no se pudieron verificar. */
  notice?: string;
};

/** Selector de fechas: dos campos que despliegan el calendario para marcar llegada y salida. */
export function DateRangePicker({ bookings, today, value, onChange, notice }: DateRangePickerProps) {
  const locale = useLocale();
  const t = useUi().calendar;
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
        aria-label={t.choose}
        className={`date-range-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        ref={triggerRef}
        type="button"
      >
        <span className={!departure && isOpen ? "is-active" : undefined}>
          <small>{t.arrival}</small>
          <strong>{arrival ? formatDay(arrival, locale) : t.chooseDate}</strong>
        </span>
        <span aria-hidden="true" className="date-range-arrow">→</span>
        <span>
          <small>{t.departure}</small>
          <strong>{departure ? formatDay(departure, locale) : t.chooseDate}</strong>
        </span>
      </button>

      {isOpen && (
        <div className="date-range-popover">
          <AvailabilityCalendar
            bookings={bookings}
            months={2}
            onSelectDay={(day) => onChange(selectDay(day, value))}
            selection={value}
            today={today}
          />
          <div className="date-range-footer">
            <div className="date-range-legend">
              <span><i className="date-range-swatch is-free" /> {t.available}</span>
              <span><i className="date-range-swatch is-booked" /> {t.unavailable}</span>
              {notice && <em>{notice}</em>}
            </div>
            <div className="date-range-actions">
              {nights > 0 && <strong>{t.nights(nights)}</strong>}
              <button className="date-range-clear" disabled={!arrival} onClick={() => onChange({ arrival: "", departure: "" })} type="button">
                {t.clear}
              </button>
              <button className="button button-primary date-range-done" onClick={() => setIsOpen(false)} type="button">
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
