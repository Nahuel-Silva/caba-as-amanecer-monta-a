"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Menú flotante de contacto, abajo a la derecha en todas las páginas: un solo botón que, al tocarlo,
 * despliega hacia arriba las opciones (WhatsApp, Instagram y teléfono) con su nombre al lado.
 * Se cierra con la X, tocando fuera del menú o con la tecla Escape.
 */
export function ContactMenu({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(event: PointerEvent) {
      // La ventana de los teléfonos está dentro del menú: tocarla no lo cierra.
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      // Si está abierta la ventana de los teléfonos, Escape cierra solo esa ventana.
      if (event.key !== "Escape" || document.querySelector(".contact-menu dialog[open]")) return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`contact-menu ${isOpen ? "is-open" : ""}`} ref={rootRef}>
      {/* Cerrado, las opciones quedan ocultas y fuera del recorrido con el teclado ("inert"). */}
      <div className="contact-menu-list" id="contact-menu-list" inert={!isOpen}>
        {children}
      </div>
      <button
        aria-controls="contact-menu-list"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Cerrar el menú de contacto" : "Contactanos: WhatsApp, Instagram o teléfono"}
        className="contact-menu-toggle"
        onClick={() => setIsOpen((open) => !open)}
        ref={toggleRef}
        type="button"
      >
        {isOpen ? (
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.4" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        ) : (
          <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12Z" />
            <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.8" />
          </svg>
        )}
      </button>
    </div>
  );
}
