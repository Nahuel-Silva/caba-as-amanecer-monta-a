import { PromotionsView, promotionsMetadata } from "@/views/promotions";

export const metadata = promotionsMetadata("es");

export default function Page() {
  return <PromotionsView locale="es" />;
}
