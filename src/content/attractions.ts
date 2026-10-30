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
  "Lugares para conocer en los alrededores de Malargüe. Los datos provienen de fuentes del Gobierno de Mendoza y pueden cambiar: antes de ir, confirmá horarios, tarifas y condiciones de acceso en la Dirección de Turismo de Malargüe (0260 4471659).";

// No cargar distancias, tiempos de viaje, horarios ni condiciones de acceso que no figuren en una fuente oficial citada.
export const attractions: Attraction[] = [
  {
    name: "Caverna de las Brujas",
    detail:
      "Reserva natural con más de 3.000 metros de galerías subterráneas de roca caliza, con estalactitas, estalagmitas y columnas, y fósiles de amonites en algunos sectores. Está en la zona de Bardas Blancas, a unos 65 km al sur de la ciudad de Malargüe. Según el Gobierno de Mendoza, las entradas se obtienen en línea.",
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
      "Parque volcánico con unos 800 conos, entre ellos el Payún Matrú, con una caldera de 9 km de diámetro, y el Payún Liso, el más alto, de 3.780 m. Es uno de los lugares del país con más guanacos: se estiman unos 14.000. Queda a unos 90 km de la ciudad de Malargüe, según el Gobierno de Mendoza. En 2024 se informaba que el circuito completo requería un guía habilitado: confirmalo antes de ir.",
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
];
