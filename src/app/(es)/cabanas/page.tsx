import { CabinsView, cabinsMetadata } from "@/views/cabins";

export const metadata = cabinsMetadata("es");

export default function Page() {
  return <CabinsView locale="es" />;
}
