import { FaqView, faqMetadata } from "@/views/faq";

export const metadata = faqMetadata("es");

export default function Page() {
  return <FaqView locale="es" />;
}
