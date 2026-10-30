"use client";

/** Abre WhatsApp para compartir la página actual con otra persona. */
export function ShareButton({ title }: { title: string }) {
  function share() {
    const text = `${title}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <button className="promotion-share" onClick={share} type="button">
      Compartir por WhatsApp
    </button>
  );
}
