import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Cabañas Amanecer de Montaña | Malargüe",
  description:
    "Cabañas Amanecer de Montaña en Malargüe, Mendoza. Información y detalles del alojamiento en preparación.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
