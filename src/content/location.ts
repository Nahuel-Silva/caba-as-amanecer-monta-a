export type Distance = { place: string; distance: string };

/**
 * Distancias por ruta desde las cabañas.
 *
 * Base: el folleto turístico de Malargüe que aportó el propietario ("Distancias del centro de Malargüe
 * hacia los atractivos"). Esas distancias son desde el centro; se corrigieron al punto de partida de las cabañas
 * comparando, en OpenStreetMap (ruteo OSRM), el camino desde la plaza San Martín y desde las cabañas:
 * - Ruta Provincial 222 (Niña Encantada, Los Molles, Pozo de las Ánimas, Las Leñas, Valle Hermoso), que sale
 *   hacia el norte por la RN 40: desde las cabañas es ~1,2 km menos. Se restó 1 km.
 * - Todos los demás destinos (RN 40 sur, RN 145, RP 186, RN 188, RP 226, Pincheira): el camino pasa por el
 *   centro, que queda a ~1,9 km de las cabañas. Se sumaron 2 km.
 * Cifras redondeadas: son aproximadas, como las del folleto.
 */
export const attractionDistances: Distance[] = [
  { place: "Centro de Malargüe", distance: "~2 km" },
  { place: "Planetario Malargüe", distance: "En la ciudad" },
  { place: "Observatorio Pierre Auger", distance: "En la ciudad" },
  { place: "Laberintos de Carmona", distance: "6 km" },
  { place: "Dique Blas Brisoli", distance: "14 km" },
  { place: "Parque de Huellas", distance: "20 km" },
  { place: "Castillos de Pincheira", distance: "29 km" },
  { place: "Cascada Manqui Malal", distance: "36 km" },
  { place: "Parque Turcará", distance: "42 km" },
  { place: "Volcán Malacara", distance: "44 km" },
  { place: "Antena DS3", distance: "45 km" },
  { place: "Grabados Rupestres", distance: "49 km" },
  { place: "Laguna de la Niña Encantada", distance: "54 km" },
  { place: "Valle de Los Molles", distance: "59 km" },
  { place: "Los Castaños", distance: "62 km" },
  { place: "Pozo de las Ánimas", distance: "66 km" },
  { place: "Caverna de las Brujas", distance: "72 km" },
  { place: "Laguna de Llancanelo", distance: "72 km" },
  { place: "Valle de Las Leñas", distance: "74 km" },
  { place: "Geoparque Llano Blanco", distance: "80 km" },
  { place: "Poti Malal", distance: "81 km" },
  { place: "Valle Hermoso", distance: "94 km" },
  { place: "Las Loicas", distance: "107 km" },
  { place: "Invernada del Viejo", distance: "118 km" },
  { place: "La Pasarela", distance: "122 km" },
  { place: "Termas Cajón Grande", distance: "137 km" },
  { place: "Real del Pehuenche", distance: "150 km" },
  { place: "Paso Pehuenche (límite con Chile)", distance: "152 km" },
  { place: "Ranquil Norte", distance: "188 km" },
  { place: "Reserva La Payunia", distance: "210 km" },
];
