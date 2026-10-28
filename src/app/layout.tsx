import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/content/site";
import { defaultDescription, metadataBase, robotsMetadata } from "@/lib/seo";
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
        <WhatsAppFloat />
      </body>
    </html>
  );
}
