import { SubscriptionView, subscriptionMetadata } from "@/views/subscription";

export const metadata = subscriptionMetadata("es");

export default async function Page({ searchParams }: PageProps<"/suscripcion">) {
  const { confirmar, baja } = await searchParams;
  return <SubscriptionView baja={typeof baja === "string" ? baja : undefined} confirmar={typeof confirmar === "string" ? confirmar : undefined} locale="es" />;
}
