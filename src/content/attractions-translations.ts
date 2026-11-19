/**
 * Traducción de los atractivos de Malargüe (src/content/attractions.ts es la referencia en español).
 * La clave es el nombre en español. Los nombres de los lugares no se traducen.
 * Si se agrega o cambia un atractivo, hay que actualizar también esta traducción.
 */
type AttractionTexts = { detail: string; alt?: string };

export const attractionsIntroTranslations: Record<"pt" | "en", string> = {
  pt: "Lugares para conhecer em Malargüe e arredores, com informações gerais de cada um. Os dados vêm de fontes oficiais (Governo de Mendoza e Turismo Malargüe) e podem mudar: antes de ir, confirme horários, tarifas e condições de acesso na Secretaria de Turismo de Malargüe (+54 260 4471659).",
  en: "Places to see in and around Malargüe, with general information about each one. The details come from official sources (the Government of Mendoza and Malargüe Tourism) and may change: before you go, check opening hours, fees and access conditions with the Malargüe Tourism Office (+54 260 4471659).",
};

/** Textos de los enlaces a las fuentes. */
export const sourceLabelTranslations: Record<"pt" | "en", Record<string, string>> = {
  pt: {
    "Fuente oficial": "Fonte oficial",
    "Nota de Los Andes (2013)": "Matéria do jornal Los Andes (2013)",
    "Turismo Malargüe y UNCuyo (PDF)": "Turismo Malargüe e UNCuyo (PDF)",
    "Turismo Malargüe (en inglés)": "Turismo Malargüe (em inglês)",
    "Municipalidad de Malargüe y UNCuyo (PDF)": "Prefeitura de Malargüe e UNCuyo (PDF)",
  },
  en: {
    "Fuente oficial": "Official source",
    "Nota de Los Andes (2013)": "Los Andes newspaper article (2013)",
    "Turismo Malargüe y UNCuyo (PDF)": "Malargüe Tourism and UNCuyo (PDF)",
    "Turismo Malargüe (en inglés)": "Malargüe Tourism",
    "Turismo Malargüe": "Malargüe Tourism",
    "Municipalidad de Malargüe y UNCuyo (PDF)": "Malargüe Municipality and UNCuyo (PDF)",
  },
};

/** "Foto propia" en cada idioma (el resto de las licencias, como CC BY-SA 4.0, no se traduce). */
export const ownPhotoLicense: Record<"pt" | "en", string> = { pt: "Foto própria", en: "Own photo" };

export const attractionTranslations: Record<"pt" | "en", Record<string, AttractionTexts>> = {
  pt: {
    "Caverna de las Brujas": {
      detail:
        "Reserva natural com mais de 3.000 metros de galerias subterrâneas de rocha calcária, com estalactites, estalagmites e colunas, e fósseis de amonites em alguns setores. Fica na região de Bardas Blancas, no sul do departamento. Segundo o Governo de Mendoza, os ingressos são comprados pela internet.",
      alt: "Interior da Caverna de las Brujas: grandes blocos e paredes de rocha calcária iluminados com lanterna, com a corda de segurança do percurso.",
    },
    "Castillos de Pincheira": {
      detail:
        "Área de lazer com formações rochosas modeladas pela água e pelo vento a partir de antigos sedimentos vulcânicos. Dá para fazer trekking, cavalgadas e acampar.",
      alt: "Formações rochosas dos Castillos de Pincheira sob um céu azul, com vegetação ao pé.",
    },
    "La Payunia": {
      detail:
        "Parque vulcânico com cerca de 800 cones, entre eles o Payún Matrú, com uma caldeira de 9 km de diâmetro, e o Payún Liso, o mais alto, com 3.780 m. É um dos lugares do país com mais guanacos: estima-se que sejam uns 14.000. Grande parte da reserva foi proposta à Unesco como Patrimônio Mundial Natural. Em 2024 informava-se que o circuito completo exigia um guia credenciado: confirme antes de ir.",
      alt: "Solo vulcânico avermelhado e preto em La Payunia, com montanhas nevadas ao fundo.",
    },
    "Laguna de la Niña Encantada": {
      detail:
        "Lagoa de águas claras junto ao rio Salado, com cerca de 80 metros de diâmetro. Formou-se pelo afundamento do terreno quando o gesso subterrâneo se dissolveu (uma dolina) e é cercada de banhados e vida silvestre. Consulte no Turismo Malargüe as condições atuais de acesso.",
      alt: "Laguna de la Niña Encantada, de água verde-turquesa, ao pé de uma parede de rocha.",
    },
    "Laguna de Llancanelo": {
      detail:
        "Reserva de fauna provincial: uma área úmida de cerca de 650 km², à qual se chega pela rodovia 186. Abriga uma grande variedade de aves, como flamingos, cisnes-de-pescoço-preto, garças e patos, e é sítio Ramsar desde 1995. Para visitá-la é preciso comprar antes os ingressos no site do Governo de Mendoza, e é obrigatório ir com um guia credenciado. A excursão leva de 6 a 8 horas, ida e volta a partir de Malargüe.",
      alt: "Laguna de Llancanelo com pastagens na margem e montanhas baixas ao fundo, sob um céu com nuvens.",
    },
    "Pozo de las Ánimas": {
      detail:
        "Duas dolinas separadas por uma faixa estreita, formadas quando a água subterrânea dissolveu o gesso do solo. Cada uma mede cerca de 200 metros de diâmetro e tem uns 80 metros de profundidade até a água, segundo medições de 1981. Fica na rodovia 222, tem placas que explicam como se formou e a entrada é livre e gratuita.",
      alt: "Dolina do Pozo de las Ánimas: um poço de paredes de terra com água verde no fundo.",
    },
    "Valle de Las Leñas": {
      detail:
        "Uma das estações de esqui mais importantes da América Latina, conhecida pela sua neve em pó: tem 16 meios de elevação e uma descida contínua de até 7 km. Oferece escola de esqui, aluguel de equipamentos e hotéis de várias categorias. No verão há trekking, tirolesa, escalada, rapel, cavalgadas e mountain bike.",
      alt: "Valle de Las Leñas coberto de neve, com os prédios da estação de esqui ao pé de montanhas brancas.",
    },
    "Valle de Los Molles": {
      detail:
        "Vale na rodovia 222, com todo o caminho asfaltado. Combina rio, montanha e gastronomia: tem restaurantes, casas de chá e banhos termais, e a sua hotelaria começou há uns 90 anos com o hotel Termas Lahuen-Co. Dá para fazer trekking, cavalgadas, mountain bike e escalada.",
      alt: "Valle de Los Molles no outono: álamos sem folhas, pastagens douradas e montanhas nevadas ao fundo.",
    },
    "Parque Cretácico Huellas de Dinosaurios": {
      detail:
        "Parque municipal criado em 2010 para proteger uma jazida descoberta em 2006 por pesquisadores do IANIGLA-Conicet: pegadas de dinossauros que viveram na região há mais de 70 milhões de anos, no período Cretáceo. Também tem um grande valor geológico.",
      alt: "Pegadas de dinossauro marcadas em uma laje de rocha clara, entre pedras.",
    },
    "Observatorio Pierre Auger": {
      detail:
        "O maior observatório de raios cósmicos do mundo, que estuda partículas de altíssima energia que chegam do espaço. A sala para visitantes oferece gratuitamente uma exposição interativa permanente, com detectores em tempo real, maquetes, vídeos e pôsteres.",
      alt: "Prédio do Observatório Pierre Auger na cidade, branco e amarelo com uma janela redonda, cercado de gramado e álamos sob um céu azul.",
    },
    "Antena DS3": {
      detail:
        "A Deep Space 3 é a antena mais moderna da Agência Espacial Europeia para acompanhar missões de exploração do espaço profundo. Foi instalada em Malargüe por um acordo entre a Argentina e a agência europeia, e a comunidade científica argentina a usa em pesquisas de radioastronomia.",
      alt: "Grande antena parabólica branca da estação DS3 recortada contra o céu ao entardecer.",
    },
    "Paso Pehuenche": {
      detail:
        "Passagem internacional para o Chile pela Rodovia Nacional 145, a principal alternativa ao Cristo Redentor. Foi totalmente pavimentada em 2016 e seu ponto mais alto fica em torno de 2.450 metros acima do nível do mar, segundo o Governo de Mendoza. Os postos de fronteira têm horário e a passagem pode fechar por neve: antes de viajar, consulte as condições.",
      alt: "Riacho de montanha na região do Paso Pehuenche, entre encostas com pasto e montanhas rochosas sob um céu azul.",
    },
    "Volcán Malacara": {
      detail:
        "Vulcão de pouco mais de 1.800 metros acima do nível do mar, no caminho para a Laguna de Llancanelo. É percorrido em um trekking guiado de dificuldade média, de cerca de 3 horas, que entra pelas suas ravinas e sobe a um mirante com vista para o norte da Payunia e para a lagoa. É preciso reservar horário antes. Não é indicado para grávidas nem para pessoas com mobilidade reduzida ou problemas cardíacos.",
      alt: "Interior de uma ravina do Volcán Malacara: paredes de rocha curvas e a luz do sol entrando por uma fenda no alto.",
    },
    "Cascada Manqui Malal": {
      detail:
        "Cachoeira de cerca de 30 metros de altura. O nome vem do mapuche: «manqui» é condor e «malal», paredão de pedra. Nas rochas de origem marinha ao redor há fósseis dos períodos Jurássico e Cretáceo.",
      alt: "Cascada Manqui Malal: um fio de água cai por uma parede de rocha alaranjada sob o céu azul.",
    },
    "Planetario Malargüe": {
      detail:
        "Centro de divulgação astronômica na cidade, com três prédios: a recepção, um museu astronômico e a sala onde acontece a sessão, com lugar para 65 pessoas. No parque há relógios de sol, e à noite os astrônomos locais também oferecem observações do céu.",
      alt: "Prédio do Planetário em forma de pirâmide azul-clara, ao lado de um relógio de sol de metal sobre uma rocha, sob um céu com nuvens.",
    },
    "Laberintos de Carmona": {
      detail:
        "Dois dos oito labirintos que existem na Argentina, com 31 corredores em 4.900 m² e um mirante de 10 metros para vê-los de cima. Há muita sombra para piquenique, churrasqueiras, brinquedos para crianças, um carrossel, aluguel de kart e bicicletas, e uma exposição de carros antigos.",
      alt: "Labirinto de cercas vivas visto do mirante, cercado de álamos e com a cordilheira ao fundo sob um céu nublado.",
    },
    "Dique Blas Brisoli": {
      detail:
        "Represa no rio Malargüe que irriga mais de 5.000 hectares e fornece a água potável da cidade. Tem um parque de árvores antigas, um camping com todos os serviços, uma criação de trutas com área de pesca particular e um restaurante com pratos à base de truta.",
    },
    "Parque Turcará": {
      detail:
        "Parque de aventura na encosta do Chihuido. Tem pontes tibetanas, via ferrata, a caverna de Turcará, uma ponte de cordas e as tirolesas mais altas do sul de Mendoza; o circuito de aventura completo dura cerca de 1 hora e meia. Também há trilhas paleontológicas autoguiadas, trilhas adaptadas e uma área de camping.",
      alt: "Cânion de Turcará: paredes de rocha clara, encostas com vegetação baixa e um pouco de neve, sob um céu limpo.",
    },
    "Grabados Rupestres de Agua Botada": {
      detail:
        "Sítio arqueológico com gravuras rupestres de cerca de 3.000 anos, parte dos mais de 96 sítios com arte rupestre do sul de Mendoza. Seus desenhos estariam relacionados à observação do céu, como os solstícios e equinócios. É cuidado e mostrado pela família Moya.",
    },
    "Geoparque Llano Blanco": {
      detail:
        "Empreendimento turístico de 70 hectares em Llano Blanco, na Rodovia 40, entre Bardas Blancas e El Manzano. É percorrido por trilhas guiadas que contam a geologia, a paleontologia, a história, a flora e a fauna do lugar, e sua principal atração é uma floresta petrificada. Também oferece comidas típicas, hospedagem e camping.",
    },
    "Valle Hermoso": {
      detail:
        "Vale de montanha com uma lagoa no centro, cortado pelos rios Cobre e Tordillo, e um mirante natural, El Centinela, a 2.000 metros de altura. O caminho é asfaltado até Las Leñas; dali em diante recomenda-se um veículo alto. Há camping com glamping, banheiros, restaurante, aluguel de barcos, caiaques e canoas, pesca com mosca, trekking e escalada.",
    },
    "Las Loicas": {
      detail:
        "Povoado de cerca de 250 pessoas às margens do rio Chico, muito arborizado, no caminho para o Paso Pehuenche. Tem mercearias, restaurante, cabanas, camping e os controles de fronteira da passagem. É a base para visitar as termas de Cajón Grande, Los Castaños e Real del Pehuenche, e dali sai a rodovia 226 rumo à passagem Planchón-Vergara.",
    },
    "Parador Los Castaños": {
      detail:
        "Refúgio de montanha no km 60 da Rodovia Nacional 145, a 2.000 metros de altura, entre paredões e o riacho Pehuenche. Abre o ano todo, com restaurante de comida típica, área de camping e domo. Há cavalgadas no verão, pesca na temporada e trekking guiado o ano todo, com raquetes se houver neve.",
    },
    "Poti Malal": {
      detail:
        "Parada turística no vale do rio Poti Malal, que em mapuche significa «grande curral de pedra». Chega-se pela Rodovia Nacional 145 e depois por 12 km de estrada de cascalho entre o rio e as montanhas. É uma região muito procurada para a pesca com mosca, com trutas arco-íris, marrons e de riacho.",
    },
    "Termas de Cajón Grande": {
      detail:
        "Cinco piscinas de águas termais ao ar livre, ao pé do cerro Campanario, na rodovia 145. Suas águas ferruginosas são recomendadas para problemas reumáticos, bronquite e artrite. Há camping com mercearia e banheiros. Como se passa pela aduana do Paso Pehuenche, é preciso levar em conta o seu horário para ir e voltar.",
    },
    "Real del Pehuenche": {
      detail:
        "Complexo de cinco domos ao pé do cerro Campanario, perto da fronteira com o Chile, para dormir em plena cordilheira. Organiza cavalgadas, caminhadas, mountain bike, esqui e snowboard com guias. O acesso depende do clima e das normas do Paso Pehuenche.",
      alt: "Vista aérea dos domos amarelos do Real del Pehuenche na neve, com montanhas nevadas e picos de rocha ao fundo ao entardecer.",
    },
    "Invernada del Viejo": {
      detail:
        "Localidade na rodovia 226, a cerca de 25 km de Las Loicas, com uma trilha rústica que sobe um riacho até a nascente de água cristalina onde ele nasce. Paisagem de cordilheira e turismo rural.",
    },
    "La Pasarela": {
      detail:
        "Estreito do rio Grande que se formou quando grandes derrames de lava, de até cerca de 100 metros de espessura, preencheram o vale e represaram o rio. Com o tempo, o rio abriu caminho pelo basalto e esculpiu a passagem estreita que se vê hoje.",
      alt: "O rio Grande corre por um cânion estreito de paredes de basalto escuro, com uma ponte de madeira que o atravessa de um lado ao outro.",
    },
    "Ranquil Norte": {
      detail:
        "A porta de entrada do departamento pelo sul, na Rodovia 40. A Prefeitura de Malargüe tem ali um posto de informações para turistas e viajantes.",
    },
  },
  en: {
    "Caverna de las Brujas": {
      detail:
        "A nature reserve with more than 3,000 meters of underground limestone galleries, with stalactites, stalagmites and columns, and ammonite fossils in some sections. It is in the Bardas Blancas area, in the south of the department. According to the Government of Mendoza, tickets are bought online.",
      alt: "Inside the Caverna de las Brujas: large limestone blocks and walls lit by a flashlight, with the safety rope along the route.",
    },
    "Castillos de Pincheira": {
      detail: "A recreation area with rock formations shaped by water and wind out of ancient volcanic sediments. You can go trekking, horseback riding and camping.",
      alt: "Rock formations of the Castillos de Pincheira under a blue sky, with vegetation at their base.",
    },
    "La Payunia": {
      detail:
        "A volcanic park with around 800 cones, including Payún Matrú, with a caldera 9 km across, and Payún Liso, the highest, at 3,780 m. It is one of the places in Argentina with the most guanacos, an estimated 14,000. Much of the reserve has been put forward to UNESCO as a Natural World Heritage Site. In 2024 the full circuit required a licensed guide: check before you go.",
      alt: "Reddish and black volcanic ground in La Payunia, with snowy mountains in the background.",
    },
    "Laguna de la Niña Encantada": {
      detail:
        "A clear-water lagoon next to the Salado River, about 80 meters across. It formed when the ground collapsed as underground gypsum dissolved (a sinkhole), and it is surrounded by wet meadows and wildlife. Check current access conditions with Malargüe Tourism.",
      alt: "Laguna de la Niña Encantada, with turquoise-green water, at the foot of a rock wall.",
    },
    "Laguna de Llancanelo": {
      detail:
        "A provincial wildlife reserve: a wetland of about 650 km², reached via Route 186. It is home to a wide variety of birds, such as flamingos, black-necked swans, herons and ducks, and has been a Ramsar site since 1995. To visit, you must buy entry tickets in advance on the Government of Mendoza website, and going with a licensed guide is mandatory. The trip takes 6 to 8 hours, round trip from Malargüe.",
      alt: "Laguna de Llancanelo with grasses along the shore and low mountains behind, under a cloudy sky.",
    },
    "Pozo de las Ánimas": {
      detail:
        "Two sinkholes separated by a narrow strip of land, formed when groundwater dissolved the gypsum in the soil. Each is about 200 meters across and about 80 meters deep down to the water, according to 1981 measurements. It is on Route 222, has signs explaining how it formed, and entry is free.",
      alt: "Sinkhole at Pozo de las Ánimas: a pit with earthen walls and green water at the bottom.",
    },
    "Valle de Las Leñas": {
      detail:
        "One of the most important ski resorts in Latin America, known for its powder snow: it has 16 lifts and a continuous run of up to 7 km. It offers a ski school, equipment rental and hotels of different categories. In summer there is trekking, ziplining, climbing, rappelling, horseback riding and mountain biking.",
      alt: "Snow-covered Valle de Las Leñas, with the ski resort buildings at the foot of white mountains.",
    },
    "Valle de Los Molles": {
      detail:
        "A valley on Route 222, paved all the way. It combines river, mountains and food: there are restaurants, tea houses and thermal baths, and its hotels began about 90 years ago with the Termas Lahuen-Co hotel. You can go trekking, horseback riding, mountain biking and climbing.",
      alt: "Valle de Los Molles in autumn: leafless poplars, golden grasses and snowy mountains in the background.",
    },
    "Parque Cretácico Huellas de Dinosaurios": {
      detail:
        "A municipal park created in 2010 to protect a site discovered in 2006 by IANIGLA-Conicet researchers: footprints of dinosaurs that lived in the area more than 70 million years ago, in the Cretaceous period. It also has great geological value.",
      alt: "Dinosaur footprints marked on a slab of light-colored rock, among stones.",
    },
    "Observatorio Pierre Auger": {
      detail:
        "The largest cosmic-ray observatory in the world, studying extremely high-energy particles that arrive from space. Its visitor room offers a free permanent interactive exhibition, with real-time detectors, models, videos and posters.",
      alt: "The Pierre Auger Observatory building in town, white and yellow with a round window, surrounded by lawn and poplars under a blue sky.",
    },
    "Antena DS3": {
      detail:
        "Deep Space 3 is the European Space Agency's most advanced antenna for tracking deep-space exploration missions. It was installed in Malargüe under an agreement between Argentina and the European agency, and Argentine scientists use it for radio astronomy research.",
      alt: "Large white dish antenna of the DS3 station against the sky at sunset.",
    },
    "Paso Pehuenche": {
      detail:
        "An international border crossing to Chile on National Route 145, the main alternative to the Cristo Redentor pass. It was fully paved in 2016 and its highest point is around 2,450 meters above sea level, according to the Government of Mendoza. The border posts have opening hours and the pass can close due to snow: check its status before you travel.",
      alt: "Mountain stream near the Paso Pehuenche, between grassy slopes and rocky hills under a blue sky.",
    },
    "Volcán Malacara": {
      detail:
        "A volcano just over 1,800 meters above sea level, on the way to Laguna de Llancanelo. It is explored on a guided trek of medium difficulty, about 3 hours long, that goes into its gullies and up to a viewpoint overlooking northern La Payunia and the lagoon. You need to book a time in advance. It is not suitable for pregnant women or for people with reduced mobility or heart conditions.",
      alt: "Inside a gully of the Volcán Malacara: curved rock walls and sunlight coming in through a crack above.",
    },
    "Cascada Manqui Malal": {
      detail:
        "A waterfall about 30 meters high. Its name comes from Mapuche: «manqui» means condor and «malal», a rock wall. The surrounding rocks of marine origin hold fossils from the Jurassic and Cretaceous periods.",
      alt: "Cascada Manqui Malal: a thin stream of water falls down an orange rock wall under a blue sky.",
    },
    "Planetario Malargüe": {
      detail:
        "An astronomy center in town with three buildings: the reception, an astronomy museum and the dome where the show takes place, with room for 65 people. There are sundials in the park, and at night local astronomers also offer stargazing sessions.",
      alt: "The pyramid-shaped light-blue Planetarium building next to a metal sundial on a rock, under a cloudy sky.",
    },
    "Laberintos de Carmona": {
      detail:
        "Two of the eight mazes in Argentina, with 31 paths over 4,900 m² and a 10-meter lookout tower to see them from above. There is plenty of shade for a picnic, barbecue grills, a playground, a merry-go-round, go-kart and bike rental, and a display of vintage cars.",
      alt: "Green hedge maze seen from the lookout, surrounded by poplars with the Andes in the background under a cloudy sky.",
    },
    "Dique Blas Brisoli": {
      detail:
        "A dam on the Malargüe River that irrigates more than 5,000 hectares and supplies the town's drinking water. It has a park with old trees, a campground with full services, a trout farm with private fishing and a restaurant serving trout dishes.",
    },
    "Parque Turcará": {
      detail:
        "An adventure park on the Chihuido slope. It has Tibetan bridges, a via ferrata, the Turcará cave, a rope bridge and the highest ziplines in southern Mendoza; the full adventure circuit takes about an hour and a half. There are also self-guided paleontology trails, accessible trails and a camping area.",
      alt: "Turcará canyon: light-colored rock walls, slopes with low scrub and a little snow, under a clear sky.",
    },
    "Grabados Rupestres de Agua Botada": {
      detail:
        "An archaeological site with rock carvings about 3,000 years old, part of the more than 96 rock-art sites in southern Mendoza. Their designs are thought to relate to watching the sky, such as solstices and equinoxes. The Moya family looks after the site and shows it to visitors.",
    },
    "Geoparque Llano Blanco": {
      detail:
        "A 70-hectare tourist site in Llano Blanco, on Route 40, between Bardas Blancas and El Manzano. Guided trails tell the story of its geology, paleontology, history, plants and wildlife, and its main attraction is a petrified forest. It also offers traditional food, lodging and camping.",
    },
    "Valle Hermoso": {
      detail:
        "A mountain valley with a lagoon in the middle, crossed by the Cobre and Tordillo rivers, and a natural lookout, El Centinela, at 2,000 meters. The road is paved as far as Las Leñas; from there a high-clearance vehicle is recommended. There is a campground with glamping, restrooms, a restaurant, boat, kayak and canoe rental, fly fishing, trekking and climbing.",
    },
    "Las Loicas": {
      detail:
        "A leafy village of about 250 people on the Chico River, on the way to the Paso Pehuenche. It has small shops, a restaurant, cabins, a campground and the border controls for the pass. It is the base for visiting the Cajón Grande hot springs, Los Castaños and Real del Pehuenche, and Route 226 leaves from here toward the Planchón-Vergara pass.",
    },
    "Parador Los Castaños": {
      detail:
        "A mountain lodge at km 60 of National Route 145, at 2,000 meters, between cliffs and the Pehuenche stream. It is open all year, with a restaurant serving traditional food, a camping area and a dome. There is horseback riding in summer, fishing in season and guided treks all year, with snowshoes when there is snow.",
    },
    "Poti Malal": {
      detail:
        "A tourist stop in the valley of the Poti Malal River, which in Mapuche means «great stone corral». You get there via National Route 145 and then 12 km of gravel road between the river and the mountains. It is a sought-after area for fly fishing, with rainbow, brown and brook trout.",
    },
    "Termas de Cajón Grande": {
      detail:
        "Five open-air hot spring pools at the foot of Cerro Campanario, on Route 145. Their iron-rich waters are recommended for rheumatic conditions, bronchitis and arthritis. There is a campground with a small store and restrooms. Since you go through the Paso Pehuenche customs post, keep its opening hours in mind for the trip there and back.",
    },
    "Real del Pehuenche": {
      detail:
        "A complex of five domes at the foot of Cerro Campanario, near the Chile border, for sleeping right in the Andes. It organizes horseback rides, hikes, mountain biking, skiing and snowboarding with guides. Access depends on the weather and the rules of the Paso Pehuenche.",
      alt: "Aerial view of the yellow domes of Real del Pehuenche in the snow, with snowy mountains and rocky peaks behind at sunset.",
    },
    "Invernada del Viejo": {
      detail:
        "A spot on Route 226, about 25 km from Las Loicas, with a rugged trail that follows a stream up to the crystal-clear spring where it begins. Andean scenery and rural tourism.",
    },
    "La Pasarela": {
      detail:
        "A narrow gorge of the Grande River that formed when huge lava flows, up to about 100 meters thick, filled the valley and dammed the river. Over time, the river cut its way through the basalt and carved the narrow passage you see today.",
      alt: "The Grande River runs through a narrow canyon with dark basalt walls, with a wooden footbridge crossing it from side to side.",
    },
    "Ranquil Norte": {
      detail: "The southern gateway to the department, on Route 40. The Malargüe Municipality has a tourist information office there for visitors and travelers.",
    },
  },
};
