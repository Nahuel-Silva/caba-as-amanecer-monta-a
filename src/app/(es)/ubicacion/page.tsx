import { LocationView, locationMetadata } from "@/views/location";

export const metadata = locationMetadata("es");

export default function Page() {
  return <LocationView locale="es" />;
}
