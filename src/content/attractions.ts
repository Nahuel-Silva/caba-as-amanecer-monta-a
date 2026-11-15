export type AttractionImage = {
  /** Ruta dentro de /public, por ejemplo "/images/malargue/payunia.jpg". */
  src: string;
  /** Texto alternativo: qué se ve en la foto. */
  alt: string;
  /** Autor o titular de la foto. */
  credit: string;
  /** Licencia o autorización, por ejemplo "CC BY-SA 4.0" o "Uso autorizado por Turismo Malargüe". */
  license: string;
  /** Enlace a la página de origen de la foto (opcional). */
  creditUrl?: string;
  /** Enlace al texto de la licencia (opcional). */
  licenseUrl?: string;
};

export type Attraction = {
  name: string;
  /** Descripción breve, basada en la fuente indicada en sourceUrl. */
  detail: string;
  /** Enlace a la fuente consultada. */
  sourceUrl?: string;
  /** Texto del enlace. Por defecto: "Fuente oficial". */
  sourceLabel?: string;
  /**
   * Foto del lugar (opcional). Solo agregarla con una licencia que permita su uso comercial
   * o con autorización escrita; copiá el autor y la licencia tal cual figuran en la fuente.
   */
  image?: AttractionImage;
};

export const attractionsIntro =
  "Lugares para conocer en Malargüe y sus alrededores, con información general de cada uno. Los datos provienen de fuentes oficiales (Gobierno de Mendoza y Turismo Malargüe) y pueden cambiar: antes de ir, confirmá horarios, tarifas y condiciones de acceso en la Dirección de Turismo de Malargüe (0260 4471659).";

const turismoMalargue = "Turismo Malargüe";

/*
 * Solo información general de cada lugar, para cualquier visitante.
 * Las distancias desde las cabañas están en la tabla de Ubicación (src/content/location.ts): no repetirlas acá.
 * No cargar horarios, tarifas ni condiciones de acceso que no figuren en una fuente oficial citada.
 */
export const attractions: Attraction[] = [
  {
    name: "Caverna de las Brujas",
    detail:
      "Reserva natural con más de 3.000 metros de galerías subterráneas de roca caliza, con estalactitas, estalagmitas y columnas, y fósiles de amonites en algunos sectores. Está en la zona de Bardas Blancas, al sur del departamento. Según el Gobierno de Mendoza, las entradas se obtienen en línea.",
    sourceUrl: "https://www.mendoza.gov.ar/prensa/turismo-low-cost-y-natural-en-el-sur-de-mendoza/",
    image: {
      src: "/images/malargue/caverna-de-las-brujas.jpg",
      alt: "Estalactitas de roca clara en el interior de la Caverna de las Brujas.",
      credit: "Pablo-flores",
      license: "CC BY-SA 2.5",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Witches%27_Cave_stalactites.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
    },
  },
  {
    name: "Castillos de Pincheira",
    detail:
      "Área de recreación con formaciones rocosas modeladas por el agua y el viento a partir de antiguos sedimentos volcánicos. Se puede hacer trekking, cabalgatas y camping.",
    sourceUrl: "https://www.mendoza.gov.ar/prensa/turismo-low-cost-y-natural-en-el-sur-de-mendoza/",
    image: {
      src: "/images/malargue/castillos-de-pincheira.jpg",
      alt: "Formaciones rocosas de los Castillos de Pincheira bajo un cielo azul, con vegetación al pie.",
      credit: "Alejandra Cartamil",
      license: "CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Castillos_de_Pincheira.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    name: "La Payunia",
    detail:
      "Parque volcánico con unos 800 conos, entre ellos el Payún Matrú, con una caldera de 9 km de diámetro, y el Payún Liso, el más alto, de 3.780 m. Es uno de los lugares del país con más guanacos: se estiman unos 14.000. Gran parte de la reserva está propuesta como Patrimonio Mundial Natural ante la Unesco. En 2024 se informaba que el circuito completo requería un guía habilitado: confirmalo antes de ir.",
    sourceUrl: "https://www.mendoza.gov.ar/prensa/payunia-y-unos-800-volcanes-para-descubrir-en-el-sur-de-mendoza/",
    image: {
      src: "/images/malargue/la-payunia.jpg",
      alt: "Suelo volcánico rojizo y negro en La Payunia, con montañas nevadas al fondo.",
      credit: "Matito",
      license: "CC BY-SA 2.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Payunia_different_landscapes.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
  },
  {
    name: "Laguna de la Niña Encantada",
    detail:
      "Laguna de aguas claras junto al río Salado, de unos 80 metros de diámetro. Se formó por el hundimiento del terreno al disolverse yeso subterráneo (una dolina) y está rodeada de vegas y vida silvestre. Consultá en Turismo Malargüe las condiciones actuales de acceso.",
    sourceUrl: "https://www.losandes.com.ar/nina-encantada-maravilla-turistica-690835/",
    sourceLabel: "Nota de Los Andes (2013)",
    image: {
      src: "/images/malargue/laguna-nina-encantada.jpg",
      alt: "Laguna de la Niña Encantada, de agua verde turquesa, al pie de una pared de roca.",
      credit: "Miguel",
      license: "CC BY-SA 2.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Laguna_de_la_Ni%C3%B1a_Encantada_-_27362553565.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
  },
  {
    name: "Laguna de Llancanelo",
    detail:
      "Reserva faunística provincial: un humedal de unos 650 km² al que se llega por la ruta 186. Alberga una gran variedad de aves, como flamencos, cisnes de cuello negro, garzas y patos, y es sitio Ramsar desde 1995. Para visitarla hay que sacar antes los tickets de ingreso en la web del Gobierno de Mendoza y es obligatorio ir con un guía habilitado. La excursión lleva entre 6 y 8 horas, ida y vuelta desde Malargüe.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-186/laguna-llancanelo/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/laguna-llancanelo.jpg",
      alt: "Laguna de Llancanelo con pastizales en la orilla y montañas bajas al fondo, bajo un cielo con nubes.",
      credit: "Pablo D. Flores",
      license: "CC BY-SA 2.5",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Laguna_de_Llancanelo_(panorama).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
    },
  },
  {
    name: "Pozo de las Ánimas",
    detail:
      "Dos dolinas separadas por una franja angosta, que se formaron cuando el agua subterránea disolvió el yeso del suelo. Cada una mide cerca de 200 metros de diámetro y tiene unos 80 metros de profundidad hasta el agua, según mediciones de 1981. Está sobre la ruta 222, tiene carteles que explican cómo se formó y la entrada es libre y gratuita.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-222/pozo-de-las-animas/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/pozo-de-las-animas.jpg",
      alt: "Dolina del Pozo de las Ánimas: un pozo de paredes de tierra con agua verde en el fondo.",
      credit: "Ernesto Brunner",
      license: "CC0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Pozo_de_las_Animas_202212.jpg",
      licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    },
  },
  {
    name: "Valle de Las Leñas",
    detail:
      "Uno de los centros de esquí más importantes de Latinoamérica, conocido por su nieve polvo: tiene 16 medios de elevación y un descenso continuo de hasta 7 km. Ofrece escuela de esquí, alquiler de equipos y hoteles de distintas categorías. En verano se hace trekking, tirolesa, escalada, rappel, cabalgatas y mountain bike.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-222/las-lenas/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/las-lenas.jpg",
      alt: "Valle de Las Leñas nevado, con los edificios del centro de esquí al pie de cerros blancos.",
      credit: "Andre Charland",
      license: "CC BY 2.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Las_Le%C3%B1as_Mendoza_Argentina_by_Andre_Charland.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    },
  },
  {
    name: "Valle de Los Molles",
    detail:
      "Valle sobre la ruta 222, con todo el camino asfaltado. Combina río, montaña y gastronomía: tiene restaurantes, casas de té y baños termales, y su actividad hotelera empezó hace unos 90 años con el hotel Termas Lahuen-Co. Se puede hacer trekking, cabalgatas, mountain bike y escalada.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-222/valle-de-los-molles/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/valle-de-los-molles.jpg",
      alt: "Valle de Los Molles en otoño: álamos sin hojas, pastizales dorados y cerros nevados al fondo.",
      credit: "ANDY ABIR ALAN",
      license: "CC BY-SA 3.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Los_Molles,_Mendoza,_Argentina_-_panoramio_(26).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    },
  },
  {
    name: "Parque Cretácico Huellas de Dinosaurios",
    detail:
      "Parque municipal creado en 2010 para proteger un yacimiento descubierto en 2006 por investigadores del IANIGLA-Conicet: huellas de dinosaurios que vivieron en la zona hace más de 70 millones de años, en el período Cretácico. También tiene un gran valor geológico.",
    sourceUrl: "https://turismo.malargue.gov.ar/newstart/wp-content/uploads/2021/06/Informe-Parque-municipal-cretacico-Huellas-de-Dinosaurios..pdf",
    sourceLabel: "Turismo Malargüe y UNCuyo (PDF)",
    image: {
      src: "/images/malargue/huellas-de-dinosaurios.jpg",
      alt: "Huellas de dinosaurio marcadas en una laja de roca clara, entre piedras.",
      credit: "Ccarosio",
      license: "CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Huellas_de_dinosaurios_Malargue.JPG",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    name: "Observatorio Pierre Auger",
    detail:
      "El observatorio de rayos cósmicos más grande del mundo, que estudia partículas de muy alta energía que llegan del espacio. Su sala para visitantes ofrece sin costo una muestra interactiva permanente, con detectores en tiempo real, maquetas, videos y pósteres.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ciudad/observatorio-rayos-cosmicos/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/observatorio-pierre-auger.jpg",
      alt: "Tanque detector de rayos cósmicos del Observatorio Pierre Auger, con su antena, en un campo de la Pampa Amarilla.",
      credit: "Roberto Fiadone",
      license: "Dominio público",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Observatorio_Pierre_Auger_Tanque_Rayos_C%C3%B3smicos.jpg",
    },
  },
  {
    name: "Antena DS3",
    detail:
      "Deep Space 3 es la antena más moderna de la Agencia Espacial Europea para seguir misiones de exploración del espacio profundo. Se instaló en Malargüe por un acuerdo entre la Argentina y la agencia europea, y la comunidad científica argentina la usa para investigaciones en radioastronomía.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-186/antena-ds3/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/antena-ds3.jpg",
      alt: "Gran antena parabólica blanca de la estación DS3 recortada contra el cielo al atardecer.",
      credit: "European Space Agency",
      license: "CC BY-SA 3.0 IGO",
      creditUrl: "https://commons.wikimedia.org/wiki/File:ESA_Malarg%C3%BCe_tracking_station_ESA15562091.jpeg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/igo/",
    },
  },
  {
    name: "Paso Pehuenche",
    detail:
      "Paso internacional a Chile por la Ruta Nacional 145, la principal alternativa al Cristo Redentor. Quedó completamente pavimentado en 2016 y su punto más alto ronda los 2.450 metros sobre el nivel del mar, según el Gobierno de Mendoza. Los complejos fronterizos tienen horario y el paso puede cerrarse por nieve: antes de viajar, consultá su estado.",
    sourceUrl: "https://www.mendoza.gov.ar/prensa/inauguraron-formalmente-el-paso-pehuenche/",
    image: {
      src: "/images/malargue/paso-pehuenche.jpg",
      alt: "Arroyo de montaña en la zona del Paso Pehuenche, entre laderas con pastos y cerros rocosos bajo un cielo azul.",
      credit: "Claudio Elias",
      license: "CC BY-SA 4.0",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Paso_Pehuenche.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
  },
  {
    name: "Volcán Malacara",
    detail:
      "Volcán de poco más de 1.800 metros sobre el nivel del mar, camino a la Laguna de Llancanelo. Se recorre con un trekking guiado de dificultad media, de unas 3 horas, que entra por sus cárcavas y sube a un mirador con vista al norte de la Payunia y a la laguna. Hay que reservar turno antes. No es apto para embarazadas ni para personas con movilidad reducida o problemas cardíacos.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-186/volcan-malacara/",
    sourceLabel: turismoMalargue,
    image: {
      src: "/images/malargue/volcan-malacara.jpg",
      alt: "Interior de una cárcava del Volcán Malacara: paredes de roca curvadas y la luz del sol entrando por una grieta arriba.",
      credit: "Cabañas Amanecer de Montaña",
      license: "Foto propia",
    },
  },
  {
    name: "Cascada Manqui Malal",
    detail:
      "Cascada de unos 30 metros de altura. Su nombre viene del mapuche: «manqui» es cóndor y «malal», barda o pared de piedra. En las rocas de origen marino que la rodean hay fósiles de los períodos Jurásico y Cretácico.",
    sourceUrl: "https://www.malargue.tur.ar/en/route-40-circuit/manqui-malal-waterfall/",
    sourceLabel: "Turismo Malargüe (en inglés)",
    image: {
      src: "/images/malargue/cascada-manqui-malal.jpg",
      alt: "Cascada Manqui Malal: un hilo de agua cae por una pared de roca anaranjada bajo el cielo azul.",
      credit: "Cabañas Amanecer de Montaña",
      license: "Foto propia",
    },
  },
  // Sin foto: no hay imágenes con licencia libre en Wikimedia Commons. Se muestran como tarjetas de texto.
  {
    name: "Planetario Malargüe",
    detail:
      "Centro de divulgación astronómica en la ciudad, con tres edificios: la recepción, un museo astronómico y la sala donde se hace la función, con lugar para 65 personas. En el parque hay relojes solares, y por la noche los astrónomos locales también ofrecen observaciones del cielo.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ciudad/planetario-malargue/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Laberintos de Carmona",
    detail:
      "Dos de los ocho laberintos que hay en la Argentina, con 31 pasillos en 4.900 m² y un mirador de 10 metros para verlos desde arriba. Hay mucha sombra para hacer picnic, parrillas, juegos para chicos, una calesita, alquiler de karting y bicicletas, y una muestra de autos antiguos.",
    sourceUrl: "https://www.malargue.tur.ar/en/city-circuit/carmona-labyrinths/",
    sourceLabel: "Turismo Malargüe (en inglés)",
  },
  {
    name: "Dique Blas Brisoli",
    detail:
      "Dique sobre el río Malargüe que riega más de 5.000 hectáreas y provee el agua potable de la ciudad. Tiene un parque de árboles añosos, un camping con todos los servicios, un criadero de truchas con coto de pesca privado y un restaurante con platos a base de trucha.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ciudad/dique-blas-brisoli/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Parque Turcará",
    detail:
      "Parque aéreo en la cuesta del Chihuido. Tiene puentes tibetanos, vía ferrata, la caverna de Turcará, un puente comando y las tirolesas más altas del sur de Mendoza; el circuito de aventura completo dura alrededor de 1 hora y media. También hay senderos paleontológicos autoguiados, senderos adaptados y un área de camping.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-40/turcara/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Grabados Rupestres de Agua Botada",
    detail:
      "Sitio arqueológico con grabados rupestres de unos 3.000 años, parte de los más de 96 sitios con arte rupestre del sur de Mendoza. Sus motivos tendrían relación con la observación del cielo, como los solsticios y equinoccios. Lo custodia y lo muestra la familia Moya.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-40/grabados-rupestres-2/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Geoparque Llano Blanco",
    detail:
      "Emprendimiento turístico de 70 hectáreas en Llano Blanco, sobre la Ruta 40, entre Bardas Blancas y El Manzano. Se recorre por senderos guiados que cuentan la geología, la paleontología, la historia, la flora y la fauna del lugar, y su principal atractivo es un bosque petrificado. También ofrece comidas típicas, alojamiento y camping.",
    sourceUrl: "https://turismo.malargue.gov.ar/newstart/wp-content/uploads/2021/06/Sitio-de-interes-Geologico-LLANO-BLANCO-0507.pdf",
    sourceLabel: "Municipalidad de Malargüe y UNCuyo (PDF)",
  },
  {
    name: "Valle Hermoso",
    detail:
      "Valle de montaña con una laguna en el centro, cruzado por los ríos Cobre y Tordillo, y un mirador natural, El Centinela, a 2.000 metros de altura. El camino es asfaltado hasta Las Leñas; desde ahí se recomienda un vehículo alto. Hay camping con glamping, sanitarios, restaurante, alquiler de botes, kayaks y canoas, pesca con mosca, trekking y escalada.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-222/eco-lodge-valle-hermoso/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Las Loicas",
    detail:
      "Pueblo de unas 250 personas sobre el río Chico, con mucha arboleda, en el camino al Paso Pehuenche. Tiene almacenes, comedor, cabañas, camping y los controles fronterizos del paso. Es la base para visitar las termas de Cajón Grande, Los Castaños y Real del Pehuenche, y de ahí sale la ruta 226 hacia el paso Planchón-Vergara.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-145/las-loicas/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Parador Los Castaños",
    detail:
      "Refugio de montaña en el km 60 de la Ruta Nacional 145, a 2.000 metros de altura, entre bardas y el arroyo Pehuenche. Abre todo el año, con comedor de comidas criollas, zona de acampe y domo. Se hacen cabalgatas en verano, pesca en temporada y trekking guiados todo el año, con raquetas si hay nieve.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-145/parador-los-castanos/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Poti Malal",
    detail:
      "Parador turístico en el valle del río Poti Malal, que en mapuche significa «gran corral de piedra». Se llega por la Ruta Nacional 145 y luego 12 km de ripio entre el río y las montañas. Es una zona muy buscada para la pesca con mosca, con truchas arco iris, marrones y de arroyo.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-145/poti-malal/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Termas de Cajón Grande",
    detail:
      "Cinco piletas de aguas termales a cielo abierto, al pie del cerro Campanario, sobre la ruta 145. Sus aguas ferrosas se recomiendan para afecciones reumáticas, bronquitis y artritis. Hay camping con proveeduría y sanitarios. Como se pasa por la aduana del Paso Pehuenche, hay que tener en cuenta su horario para ir y volver.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-145/termas-de-cajon-grande/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Real del Pehuenche",
    detail:
      "Complejo de cinco domos al pie del cerro Campanario, cerca del límite con Chile, para dormir en plena cordillera. Organiza cabalgatas, caminatas, mountain bike, esquí y snowboard con guías. El acceso depende del clima y de las normas del Paso Pehuenche.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-145/real-del-pehuenche/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Invernada del Viejo",
    detail:
      "Paraje sobre la ruta 226, a unos 25 km de Las Loicas, con un sendero agreste que remonta un arroyo hasta el manantial de agua cristalina donde nace. Paisaje cordillerano y turismo rural.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-226/invernada-del-viejo/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "La Pasarela",
    detail:
      "Angostura del río Grande que se formó cuando grandes coladas de lava rellenaron el valle, con hasta unos 100 metros de espesor, y lo embalsaron. Con el tiempo, el río se abrió paso a través del basalto y talló el paso angosto que se ve hoy.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-40/la-pasarela/",
    sourceLabel: turismoMalargue,
  },
  {
    name: "Ranquil Norte",
    detail:
      "La puerta de entrada al departamento por el sur, sobre la Ruta 40. La Municipalidad de Malargüe tiene ahí una oficina de informes para turistas y viajeros.",
    sourceUrl: "https://www.malargue.tur.ar/circuito-ruta-40/ranquil-norte/",
    sourceLabel: turismoMalargue,
  },
];
