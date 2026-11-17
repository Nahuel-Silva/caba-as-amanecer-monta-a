import { ConditionsView, conditionsMetadata } from "@/views/conditions";

export const metadata = conditionsMetadata("es");

export default function Page() {
  return <ConditionsView locale="es" />;
}
