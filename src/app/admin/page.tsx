import type { Metadata } from "next";
import { AdminPanel } from "@/components/admin-panel";
import { getCabins } from "@/lib/cabins";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const cabins = getCabins().map(({ slug, displayName }) => ({ slug, name: displayName }));

  return (
    <main className="wrap admin-page">
      <AdminPanel cabins={cabins} />
    </main>
  );
}
