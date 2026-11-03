import { site } from "@/content/site";

export type Distance = {
  place: string;
  distance: string;
  /** La distancia se mide desde la ciudad de Malargüe, no desde las cabañas. */
  fromCity?: boolean;
};

/** Distancias informadas en la web. Las marcadas con fromCity vienen del Gobierno de Mendoza. */
export const distances: Distance[] = [
  { place: "Ruta Nacional 40, acceso Norte", distance: "100 m" },
  { place: "Centro de Malargüe", distance: "~1 km" },
  { place: "Caverna de las Brujas", distance: "~65 km", fromCity: true },
  { place: "Centro de ski Las Leñas", distance: "80 km" },
  { place: "La Payunia", distance: "~90 km", fromCity: true },
];

export const arrivalSteps = [
  "Llegá a Malargüe por la Ruta Nacional 40.",
  "Entrá a la ciudad por el acceso Norte.",
  `A 100 metros de la ruta, buscá ${site.address}.`,
];

export const stayTimes = [
  { label: "Check-in", value: "Desde las 14 hs" },
  { label: "Check-out", value: "Hasta las 10 hs" },
];
