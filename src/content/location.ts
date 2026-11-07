export type Distance = { place: string; distance: string };

/**
 * Distancias desde las cabañas.
 * El centro de Malargüe (~1 km) es dato del propietario. Las de los atractivos son las distancias por ruta
 * desde la ciudad que publica Turismo Malargüe (https://www.malargue.tur.ar/): como las cabañas están a ~1 km
 * del centro, valen casi igual desde acá.
 * La Payunia no figura porque las fuentes dan entre 90 y 208 km según el punto de llegada.
 */
export const attractionDistances: Distance[] = [
  { place: "Centro de Malargüe", distance: "~1 km" },
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
