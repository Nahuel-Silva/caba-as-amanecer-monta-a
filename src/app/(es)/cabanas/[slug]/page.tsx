import type { Metadata } from "next";
import { getCabins } from "@/lib/cabins";
import { CabinView, cabinMetadata } from "@/views/cabins";

export function generateStaticParams() {
  return getCabins().map((cabin) => ({ slug: cabin.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cabanas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return cabinMetadata(slug, "es");
}

export default async function Page({ params }: PageProps<"/cabanas/[slug]">) {
  const { slug } = await params;
  return <CabinView locale="es" slug={slug} />;
}
