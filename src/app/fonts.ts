import { Fraunces, Nunito } from "next/font/google";

// Estilo rústico cálido: Nunito (redondeada, muy legible) para el texto y
// Fraunces (serif "blanda") para los títulos. Las usan los diseños raíz de cada idioma.
export const sans = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const serif = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});
