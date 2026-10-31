import type { Metadata } from "next";
import { Nunito, Fraunces } from "next/font/google";
import { ReservationFloat } from "@/components/reservation-float";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/content/site";
import { getCabins } from "@/lib/cabins";
import { isReservationEmailConfigured } from "@/lib/reservation-email";
import { defaultDescription, metadataBase, robotsMetadata } from "@/lib/seo";
import "./globals.css";

// Estilo rústico cálido: Nunito (redondeada, muy legible) para el texto y
// Fraunces (serif "blanda") para los títulos.
const sans = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${site.name} | Malargüe`,
    template: `%s | ${site.name}`,
  },
  description: defaultDescription,
  robots: robotsMetadata,
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: site.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <div className="contact-floats">
          {(isReservationEmailConfigured || process.env.NODE_ENV === "development") && (
            <ReservationFloat cabins={getCabins().map(({ slug, displayName }) => ({ slug, name: displayName }))} />
          )}
          <WhatsAppFloat />
        </div>
      </body>
    </html>
  );
}
