import { HomeView, homeMetadata } from "@/views/home";

export const metadata = homeMetadata("es");

export default function Home() {
  return <HomeView locale="es" />;
}
