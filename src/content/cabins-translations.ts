import type { CabinFact, CabinFeatureGroup } from "@/content/cabins";

/**
 * Traducción de los datos de las cabañas (src/content/cabins.ts es la referencia en español).
 * Los nombres de las cabañas no se traducen. Las descripciones de las fotos van en el mismo orden que en cabins.ts.
 */
type CabinTexts = {
  cardSummary: string;
  description: string;
  facts: CabinFact[];
  featureGroups: CabinFeatureGroup[];
  imageAlts: Record<string, string[]>;
};

export const cabinTranslations: Record<"pt" | "en", CabinTexts> = {
  pt: {
    cardSummary: "Para 4 pessoas · 2 quartos · banheiro completo",
    description:
      "Uma cabana completa dentro do complexo Amanecer de Montaña, com dois quartos, sala de estar e jantar com lareira a lenha, cozinha equipada com mesa e banheiro completo. Se vierem cinco pessoas, é possível acrescentar uma cama extra de solteiro com custo adicional.",
    facts: [
      { label: "Capacidade", value: "4 pessoas + cama extra opcional" },
      { label: "Quartos", value: "2" },
      { label: "Banheiro", value: "1 completo" },
      { label: "Garagem", value: "Individual coberta" },
    ],
    featureGroups: [
      {
        title: "Quartos e banheiro",
        items: [
          "Quarto de casal com cama box Queen",
          "Quarto com duas camas box de solteiro largas",
          "Cama extra de solteiro sob pedido, com custo adicional",
          "Armários nos quartos",
          "Banheiro completo com chuveiro e antessala",
        ],
      },
      {
        title: "Cozinha",
        items: [
          "Cooktop de 4 bocas (não tem forno)",
          "Geladeira e micro-ondas",
          "Chaleira elétrica, cafeteira e torradeira",
          "Louça completa e chás e café",
        ],
      },
      {
        title: "Conforto",
        items: [
          "Ar-condicionado",
          "Calefação a gás natural (com exaustão para fora)",
          "Lareira a lenha",
          "Wi-Fi e televisão de 32 polegadas com DIRECTV",
          "Poltronas, tomadas e conectores USB",
        ],
      },
      {
        title: "Serviços incluídos",
        items: [
          "Roupa de cama e banho, com troca de lençóis e toalhas a cada 3 dias",
          "Limpeza dia sim, dia não, das 9h às 12h",
          "Garagem individual coberta",
          "Churrasqueira individual, própria da cabana",
        ],
      },
      {
        title: "Área externa e localização",
        items: [
          "Entrada privativa com portão elétrico",
          "Poltronas externas no pátio",
          "A 100 metros da Rodovia Nacional 40, pelo acesso Norte a Malargüe",
          "A cerca de 1 quilômetro do centro",
        ],
      },
      {
        title: "Regras da casa",
        items: [
          "Check-in a partir das 14h e check-out até as 10h",
          "A limpeza é feita sem hóspedes: os objetos pessoais ficam guardados no armário. O complexo não se responsabiliza por perdas.",
          "Se a chegada for mais tarde ou a saída mais cedo do que o combinado, cobra-se a estadia completa",
          "Não são aceitos animais de estimação",
        ],
      },
    ],
    imageAlts: {
      payunia: [
        "Cabana Payunia ao pé de uma fileira de álamos, com o jardim gramado na frente e céu de tempestade.",
        "Varanda coberta da cabana Payunia junto à parede de pedra, de frente para o jardim.",
        "Frente da cabana Payunia, com parede de pedra e chaminé, sob um céu azul.",
        "Cabana Payunia com a sua varanda coberta e o jardim na frente.",
        "Quarto com cama de casal, edredom listrado e toalhas sobre a cama.",
        "Cama de casal com toalhas, ao lado do armário de madeira.",
        "Quarto com duas camas de solteiro e prateleira de madeira sob a janela.",
        "Duas camas de solteiro com edredons escuros floridos.",
        "Banheiro com revestimento escuro, janela e nicho de pastilhas.",
      ],
      pehuenche: [
        "Exterior da cabana Pehuenche, com paredes verdes, varanda e chaminé de pedra, cercada de jardim.",
        "Entrada da cabana Pehuenche com porta de madeira, churrasqueira e jardim arborizado.",
        "Lateral da cabana Pehuenche com base de pedra, sob um céu de nuvens e álamos.",
        "Sala de estar e jantar com mesa para seis, poltronas, televisão e lareira.",
        "Cozinha com geladeira, micro-ondas, bancada e mesa.",
        "Quarto com cama de casal, edredom bordô e toalhas sobre a cama.",
        "Cama com edredom de listras coloridas e toalhas, junto à janela.",
        "Quarto com duas camas de solteiro e edredons de listras coloridas.",
        "Banheiro com bancada, pia e espelho.",
      ],
    },
  },
  en: {
    cardSummary: "Sleeps 4 · 2 bedrooms · full bathroom",
    description:
      "A whole cabin within the Amanecer de Montaña complex, with two bedrooms, a living and dining room with a wood-burning fireplace, an equipped kitchen with dining area and a full bathroom. If there are five of you, a single extra bed can be added for an extra charge.",
    facts: [
      { label: "Sleeps", value: "4 guests + optional extra bed" },
      { label: "Bedrooms", value: "2" },
      { label: "Bathroom", value: "1 full bathroom" },
      { label: "Parking", value: "Private covered space" },
    ],
    featureGroups: [
      {
        title: "Bedrooms and bathroom",
        items: [
          "Main bedroom with a queen-size bed",
          "Bedroom with two large single beds",
          "Single extra bed on request, for an extra charge",
          "Wardrobes in the bedrooms",
          "Full bathroom with shower and a dressing area",
        ],
      },
      {
        title: "Kitchen",
        items: [
          "4-burner cooktop (no oven)",
          "Fridge and microwave",
          "Electric kettle, coffee maker and toaster",
          "Full set of dishes, plus tea and coffee",
        ],
      },
      {
        title: "Comfort",
        items: [
          "Air conditioning",
          "Natural gas heating (sealed, vented outdoors)",
          "Wood-burning fireplace",
          "Wi-Fi and 32-inch TV with DIRECTV",
          "Armchairs, power outlets and USB ports",
        ],
      },
      {
        title: "Included services",
        items: [
          "Bed linen and towels, changed every 3 days",
          "Cleaning every other day, from 9 a.m. to 12 p.m.",
          "Private covered parking space",
          "Private barbecue grill for each cabin",
        ],
      },
      {
        title: "Outdoors and location",
        items: [
          "Private entrance with an electric gate",
          "Outdoor armchairs on the patio",
          "100 meters from National Route 40, at the northern entrance to Malargüe",
          "About 1 kilometer from the town center",
        ],
      },
      {
        title: "House rules",
        items: [
          "Check-in from 2 p.m. and check-out until 10 a.m.",
          "Cleaning is done while guests are out: personal belongings are kept in the wardrobe. The complex is not responsible for their loss.",
          "If you arrive later or leave earlier than agreed, the full stay is charged",
          "No pets allowed",
        ],
      },
    ],
    imageAlts: {
      payunia: [
        "Payunia cabin at the foot of a row of poplars, with the lawn in front and a stormy sky.",
        "Covered porch of the Payunia cabin next to the stone wall, facing the lawn.",
        "Front of the Payunia cabin, with a stone wall and chimney, under a blue sky.",
        "Payunia cabin with its covered porch and the garden in front.",
        "Bedroom with a double bed, a striped duvet and towels on the bed.",
        "Double bed with towels, next to the wooden wardrobe.",
        "Bedroom with two single beds and a wooden shelf under the window.",
        "Two single beds with dark floral duvets.",
        "Bathroom with dark tiles, a window and a mosaic niche.",
      ],
      pehuenche: [
        "Outside of the Pehuenche cabin, with green walls, a porch and a stone chimney, surrounded by garden.",
        "Entrance of the Pehuenche cabin with a wooden door, barbecue grill and a garden with trees.",
        "Side of the Pehuenche cabin with a stone base, under a cloudy sky and poplars.",
        "Living and dining room with a table for six, armchairs, TV and fireplace.",
        "Kitchen with fridge, microwave, counter and table.",
        "Bedroom with a double bed, a burgundy duvet and towels on the bed.",
        "Bed with a colorful striped duvet and towels, by the window.",
        "Bedroom with two single beds and colorful striped duvets.",
        "Bathroom with counter, sink and mirror.",
      ],
    },
  },
};
