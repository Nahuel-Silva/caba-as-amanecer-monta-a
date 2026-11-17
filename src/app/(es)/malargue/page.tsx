import { MalargueView, malargueMetadata } from "@/views/malargue";

export const metadata = malargueMetadata("es");

export default function Page() {
  return <MalargueView locale="es" />;
}
