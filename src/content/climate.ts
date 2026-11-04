/**
 * Clima habitual de Malargüe, mes a mes.
 * Valores oficiales del Servicio Meteorológico Nacional para la estación Malargüe Aero,
 * "Estadísticas Climatológicas Normales - período 1991-2020". No editar a mano sin una fuente.
 */

export type MonthlyClimate = {
  month: string;
  /** Temperatura máxima media (°C). */
  max: number;
  /** Temperatura mínima media (°C). */
  min: number;
  /** Precipitación media del mes (mm). */
  rainMm: number;
  /** Días con precipitación superior a 1 mm. */
  rainDays: number;
};

export const climateSource = {
  label: "Servicio Meteorológico Nacional",
  detail: "Malargüe Aero, normales 1991-2020",
  url: "https://www.smn.gob.ar/estadisticas",
};

/** De enero a diciembre. */
export const monthlyClimate: MonthlyClimate[] = [
  { month: "Enero", max: 29.1, min: 11.6, rainMm: 22.7, rainDays: 3.0 },
  { month: "Febrero", max: 27.2, min: 10.7, rainMm: 32.4, rainDays: 4.1 },
  { month: "Marzo", max: 25.0, min: 8.9, rainMm: 30.2, rainDays: 3.2 },
  { month: "Abril", max: 20.0, min: 4.8, rainMm: 30.4, rainDays: 3.1 },
  { month: "Mayo", max: 15.3, min: 1.5, rainMm: 30.4, rainDays: 3.8 },
  { month: "Junio", max: 12.5, min: -1.0, rainMm: 33.5, rainDays: 4.0 },
  { month: "Julio", max: 11.8, min: -2.3, rainMm: 24.4, rainDays: 2.9 },
  { month: "Agosto", max: 14.2, min: -1.1, rainMm: 26.9, rainDays: 3.2 },
  { month: "Septiembre", max: 17.0, min: 1.3, rainMm: 17.4, rainDays: 2.9 },
  { month: "Octubre", max: 20.5, min: 4.4, rainMm: 24.5, rainDays: 2.9 },
  { month: "Noviembre", max: 24.4, min: 7.3, rainMm: 25.9, rainDays: 2.6 },
  { month: "Diciembre", max: 27.5, min: 10.0, rainMm: 21.9, rainDays: 2.8 },
];

/** Consejo para preparar el viaje según las temperaturas habituales del mes. */
export function climateTip({ max, min }: MonthlyClimate): string {
  if (min < 0) return "Las noches suelen bajar de 0°: traé abrigo de invierno y, si venís en auto, consultá el estado de las rutas.";
  if (min < 6) return "Los días son templados y las noches frías: traé abrigo para la tarde y la noche.";
  if (max >= 27) return "Los días son calurosos y secos, pero refresca de noche: traé protector solar y un abrigo liviano.";
  return "Días agradables y noches frescas: traé ropa en capas.";
}
