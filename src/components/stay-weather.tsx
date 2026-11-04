"use client";

import { useEffect, useState, type ReactNode } from "react";
import { climateTip } from "@/content/climate";
import {
  climateSource,
  conditionLabels,
  forecastSource,
  formatDegrees,
  formatWeekday,
  getStayWeather,
  type DayForecast,
  type Forecast,
  type WeatherCondition,
} from "@/lib/weather";
import "./stay-weather.css";

// Una sola consulta por visita: la barra y el formulario comparten el mismo pronóstico.
let forecastRequest: Promise<DayForecast[]> | null = null;

function loadForecast() {
  forecastRequest ??= fetch("/api/clima")
    .then((response) => (response.ok ? (response.json() as Promise<Forecast>) : { days: [] }))
    .then((result) => result.days)
    .catch(() => {
      forecastRequest = null;
      return [];
    });
  return forecastRequest;
}

function WeatherIcon({ condition }: { condition: WeatherCondition }) {
  const sun = <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>;
  const cloud = <path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18Z" />;
  const icons: Record<WeatherCondition, ReactNode> = {
    clear: sun,
    partly: <><path d="M8 3.5v1.2M3.5 8h1.2M4.8 4.8l.9.9M11.2 4.8l-.9.9" /><path d="M5.6 10.6A3 3 0 1 1 10.9 7" /><path d="M9 20h8a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6 1.3A2.9 2.9 0 0 0 9 20Z" /></>,
    cloudy: cloud,
    rain: <><path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 15Z" /><path d="M9 18l-1 2.5M13 18l-1 2.5M17 18l-1 2.5" /></>,
    sleet: <><path d="M7 15h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 15Z" /><path d="M9 18l-1 2.5M16 18l-1 2.5" /><path d="M12.5 19.5h.01" /></>,
    snow: <><path d="M7 14h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 14Z" /><path d="M8.5 18h.01M12 20h.01M15.5 18h.01M10 21.5h.01M14 21.5h.01" /></>,
  };

  return (
    <svg aria-hidden="true" className="stay-weather-icon" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
      {icons[condition]}
    </svg>
  );
}

/** Pronóstico de los días de la estadía si ya existe; si no, el clima habitual de esos meses. */
export function StayWeather({ arrival, departure }: { arrival: string; departure: string }) {
  const [days, setDays] = useState<DayForecast[] | null>(null);

  useEffect(() => {
    let isCurrent = true;
    loadForecast().then((result) => {
      if (isCurrent) setDays(result);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  if (days === null || !arrival || !departure) return null;

  const { forecast, hasDaysWithoutForecast, months } = getStayWeather(arrival, departure, days);
  const showClimate = forecast.length === 0 || hasDaysWithoutForecast;

  return (
    <div className="stay-weather">
      {forecast.length > 0 && (
        <>
          <p className="stay-weather-title">Pronóstico para tu estadía</p>
          <ul className="stay-weather-days">
            {forecast.map((day) => (
              <li key={day.date}>
                <WeatherIcon condition={day.condition} />
                <span className="stay-weather-day">{formatWeekday(day.date)}</span>
                <span className="stay-weather-temp">
                  <strong>{formatDegrees(day.max)}</strong> / {formatDegrees(day.min)}
                </span>
                <span className="stay-weather-label">{conditionLabels[day.condition]}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {showClimate && (
        <div className="stay-weather-climate">
          {forecast.length === 0 && <p className="stay-weather-title">Clima habitual en Malargüe</p>}
          {months.map((month) => (
            <p key={month.month}>
              <strong>{forecast.length > 0 ? `Para los demás días (${month.month.toLowerCase()})` : month.month}:</strong>{" "}
              máximas de {formatDegrees(month.max)} y mínimas de {formatDegrees(month.min)} en promedio.
            </p>
          ))}
          {/* Un solo consejo, el del mes más frío de la estadía. */}
          {forecast.length === 0 && <p>{climateTip(months.reduce((a, b) => (b.min < a.min ? b : a)))}</p>}
        </div>
      )}

      <p className="stay-weather-source">
        {forecast.length > 0 && <>Pronóstico: <a href={forecastSource.url} rel="noopener noreferrer" target="_blank">{forecastSource.label}<span className="sr-only"> (se abre en una pestaña nueva)</span></a>. </>}
        {showClimate && <>Promedios: <a href={climateSource.url} rel="noopener noreferrer" target="_blank">{climateSource.label}<span className="sr-only"> (se abre en una pestaña nueva)</span></a> ({climateSource.detail}).</>}
      </p>
    </div>
  );
}
