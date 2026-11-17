import { RootShell, rootMetadata } from "@/components/root-shell";

/** Diseño raíz de las páginas en español (sin prefijo en la dirección). */
export const metadata = rootMetadata("es");

export default function SpanishLayout({ children }: LayoutProps<"/">) {
  return <RootShell locale="es">{children}</RootShell>;
}
