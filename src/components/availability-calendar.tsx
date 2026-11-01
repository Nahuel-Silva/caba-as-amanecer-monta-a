"use client";

import { useState } from "react";
import { isDaySelectable, isNightBooked, type Booking, type StaySelection } from "@/lib/availability";

const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
const maxMonthsAhead = 18;

type AvailabilityCalendarProps = {
  bookings: Booking[];
  today: string;
  months: number;
  selection: StaySelection;
  onSelectDay: (day: string) => void;
};

function monthDays(monthIndex: number) {
  const year = Math.floor(monthIndex / 12);
  const month = monthIndex % 12;
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekDay = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const label = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric", timeZone: "UTC" }).format(Date.UTC(year, month, 1));
  const days = Array.from({ length: total }, (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
  });
  return { label: label.charAt(0).toUpperCase() + label.slice(1), firstWeekDay, days };
}

function dayLabel(day: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

/** Grilla de meses para marcar un rango. Al pasar el mouse se anticipa la estadía antes de elegir la salida. */
export function AvailabilityCalendar({ bookings, today, months, selection, onSelectDay }: AvailabilityCalendarProps) {
  const firstMonth = Number(today.slice(0, 4)) * 12 + Number(today.slice(5, 7)) - 1;
  const [startMonth, setStartMonth] = useState(firstMonth);
  const [hoveredDay, setHoveredDay] = useState("");
  const lastStartMonth = firstMonth + maxMonthsAhead - months;
  const visibleMonths = Array.from({ length: months }, (_, index) => monthDays(startMonth + index));

  const { arrival, departure } = selection;
  const canPreview = arrival !== "" && departure === "" && hoveredDay > arrival && isDaySelectable(hoveredDay, selection, today, bookings);
  const rangeEnd = departure || (canPreview ? hoveredDay : "");

  return (
    <div className="availability-calendar" onMouseLeave={() => setHoveredDay("")}>
      <div className="availability-nav">
        <button aria-label="Mes anterior" disabled={startMonth <= firstMonth} onClick={() => setStartMonth(startMonth - 1)} type="button">
          ←
        </button>
        <button aria-label="Mes siguiente" disabled={startMonth >= lastStartMonth} onClick={() => setStartMonth(startMonth + 1)} type="button">
          →
        </button>
      </div>

      <div className="availability-months">
        {visibleMonths.map(({ label, firstWeekDay, days }) => (
          <div className="availability-month" key={label}>
            <h3 aria-live="polite">{label}</h3>
            <div className="availability-grid">
              {weekDays.map((weekDay, index) => (
                <span aria-hidden="true" className="availability-weekday" key={index}>{weekDay}</span>
              ))}
              {firstWeekDay > 0 && <span style={{ gridColumn: `span ${firstWeekDay}` }} />}
              {days.map((day) => {
                const isBooked = isNightBooked(day, bookings);
                const isSelectable = isDaySelectable(day, selection, today, bookings);
                const isEdge = day === arrival || day === departure;
                const classes = [
                  "availability-day",
                  isBooked && !isSelectable && "is-booked",
                  day < today && "is-past",
                  isEdge && "is-selected",
                  rangeEnd && day === arrival && "is-range-start",
                  rangeEnd && day === rangeEnd && "is-range-end",
                  rangeEnd && day > arrival && day < rangeEnd && "is-in-range",
                  canPreview && day === rangeEnd && "is-preview",
                ].filter(Boolean).join(" ");

                return (
                  <button
                    aria-label={`${dayLabel(day)}${isBooked ? ", no disponible" : ""}`}
                    aria-pressed={isEdge}
                    className={classes}
                    disabled={!isSelectable}
                    key={day}
                    onClick={() => onSelectDay(day)}
                    onFocus={() => setHoveredDay(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    type="button"
                  >
                    {Number(day.slice(8))}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
