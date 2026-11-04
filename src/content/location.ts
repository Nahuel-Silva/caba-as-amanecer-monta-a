export type Distance = { place: string; distance: string };

/** Lo que queda a pasos de las cabañas, según los datos del propietario. */
export const nearbyDistances: Distance[] = [
  { place: "Ruta Nacional 40, acceso Norte", distance: "100 m" },
  { place: "Centro de Malargüe", distance: "~1 km" },
];

export const attractionDistancesSource = {
  label: "Turismo Malargüe",
  url: "https://www.malargue.tur.ar/",
};

/**
 * Distancias por ruta desde la ciudad de Malargüe, publicadas en los circuitos de Turismo Malargüe.
 * La Payunia no figura porque las fuentes dan entre 90 y 208 km según el punto de llegada.
 */
export const attractionDistances: Distance[] = [
  { place: "Planetario Malargüe", distance: "En la ciudad" },
  { place: "Observatorio Pierre Auger", distance: "En la ciudad" },
  { place: "Castillos de Pincheira", distance: "27 km" },
  { place: "Manqui Malal", distance: "34 km" },
  { place: "Volcán Malacara", distance: "42 km" },
  { place: "Laguna de la Niña Encantada", distance: "55 km" },
  { place: "Valle de Los Molles", distance: "60 km" },
  { place: "Pozo de las Ánimas", distance: "67 km" },
  { place: "Caverna de las Brujas", distance: "70 km" },
  { place: "Valle de Las Leñas", distance: "75 km" },
  { place: "Laguna de Llancanelo", distance: "75 km" },
  { place: "Las Loicas", distance: "105 km" },
];
