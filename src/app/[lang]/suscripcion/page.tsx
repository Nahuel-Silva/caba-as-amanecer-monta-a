import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { SubscriptionView, subscriptionMetadata } from "@/views/subscription";

export async function generateMetadata({ params }: PageProps<"/[lang]/suscripcion">): Promise<Metadata> {
  const { lang } = await params;
  return subscriptionMetadata(isLocale(lang) ? lang : "es");
}

export default async function Page({ params, searchParams }: PageProps<"/[lang]/suscripcion">) {
  const { lang } = await params;
  const { confirmar, baja } = await searchParams;
  return (
    <SubscriptionView
      baja={typeof baja === "string" ? baja : undefined}
      confirmar={typeof confirmar === "string" ? confirmar : undefined}
      locale={isLocale(lang) ? lang : "es"}
    />
  );
}
