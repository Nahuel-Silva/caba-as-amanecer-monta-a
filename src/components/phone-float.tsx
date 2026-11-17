"use client";

import { useEffect, useRef, useState } from "react";
import { phoneContacts } from "@/lib/phones";

/**
 * Opción de llamada del menú de contacto. Abre una ventana con los teléfonos.
 * En el celular cada número llama al tocarlo; en la computadora, como desde ahí no se puede llamar,
 * hacer clic en un número lo copia y avisa "¡Copiado!".
 */
export function PhoneFloat() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [canCall, setCanCall] = useState(false);
  const [copied, setCopied] = useState("");
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy(number: string, item: HTMLElement) {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      // Sin permiso para copiar: se deja el número seleccionado para copiarlo con Ctrl+C.
      const range = document.createRange();
      range.selectNodeContents(item.querySelector("strong") ?? item);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      return;
    }
    setCopied(number);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(""), 2500);
  }

  useEffect(() => {
    // Celulares y tablets: pantalla táctil sin mouse.
    const query = window.matchMedia("(pointer: coarse) and (hover: none)");
    const update = () => setCanCall(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (phoneContacts.length === 0) return null;

  const close = () => dialogRef.current?.close();

  return (
    <>
      <button aria-haspopup="dialog" aria-label="Reservar por teléfono" className="contact-option is-phone" onClick={() => dialogRef.current?.showModal()} type="button">
        <span aria-hidden="true" className="contact-option-label">Llamar</span>
        <span className="contact-option-icon">
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2Z" />
        </svg>
        </span>
      </button>

      <dialog
        aria-labelledby="phone-dialog-title"
        className="phone-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        ref={dialogRef}
      >
        <div className="phone-dialog-content">
          <div className="phone-dialog-header">
            <h2 id="phone-dialog-title">Reservá por teléfono</h2>
            <button aria-label="Cerrar" className="phone-dialog-close" onClick={close} type="button">×</button>
          </div>
          <p className="phone-dialog-intro">{canCall ? "Tocá un número para llamar." : "Llamanos desde tu celular a cualquiera de estos números. Hacé clic en uno para copiarlo."}</p>
          <ul className="phone-list">
            {phoneContacts.map((phone) => (
              <li key={phone.href}>
                {canCall ? (
                  <a className="phone-item is-link" href={phone.href}>
                    {phone.name && <span className="phone-name">{phone.name}</span>}
                    <strong>{phone.display}</strong>
                    <span className="phone-action">Llamar</span>
                  </a>
                ) : (
                  <button className="phone-item is-copy" onClick={(event) => copy(phone.display, event.currentTarget)} type="button">
                    {phone.name && <span className="phone-name">{phone.name}</span>}
                    <strong>{phone.display}</strong>
                    <span aria-live="polite" className={`phone-action ${copied === phone.display ? "is-done" : "is-copy"}`}>
                      {copied === phone.display ? "¡Copiado!" : "Copiar"}
                    </span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </>
  );
}
