"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ReservationForm } from "@/components/reservation-form";
import { openReservationEvent, reservationClosedEvent, reservationSentEvent, type ReservationPrefill } from "@/lib/reservation";

/** Panel del formulario de reserva. Lo abre la barra de reserva con los datos ya elegidos. */
export function ReservationDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [prefill, setPrefill] = useState<ReservationPrefill | null>(null);
  const wasSent = useRef(false);
  const isOpen = useRef(false);

  /**
   * Al cerrar después de enviar, el formulario y la barra de reserva vuelven a quedar vacíos.
   * Si no se envió, se conserva lo escrito. Se llama al cerrar por cualquier vía (la X, Esc o un clic afuera)
   * y solo actúa una vez por apertura.
   */
  const finishClose = useCallback(() => {
    if (!isOpen.current) return;
    isOpen.current = false;
    window.dispatchEvent(new Event(reservationClosedEvent));
    if (!wasSent.current) return;
    wasSent.current = false;
    window.dispatchEvent(new Event(reservationSentEvent));
    setPrefill(null);
    setFormVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    function openWithData(event: Event) {
      setPrefill((event as CustomEvent<ReservationPrefill>).detail);
      dialog?.showModal();
      isOpen.current = true;
    }

    window.addEventListener(openReservationEvent, openWithData);
    // Esc cierra el diálogo sin pasar por close(): el evento nativo "close" lo cubre.
    dialog?.addEventListener("close", finishClose);
    return () => {
      window.removeEventListener(openReservationEvent, openWithData);
      dialog?.removeEventListener("close", finishClose);
    };
  }, [finishClose]);

  function close() {
    dialogRef.current?.close();
    finishClose();
  }

  return (
    <dialog
      aria-labelledby="reservation-dialog-title"
      className="reservation-dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
    >
      <div className="reservation-dialog-content">
        <div className="reservation-dialog-header">
          <div>
            <h2 id="reservation-dialog-title">Solicitá tu reserva</h2>
            <p>Bloqueamos tus fechas por 24 horas y te respondemos con la tarifa.</p>
          </div>
          <button aria-label="Cerrar" className="reservation-dialog-close" onClick={close} type="button">×</button>
        </div>
        {prefill && (
          <ReservationForm
            key={formVersion}
            onEdit={close}
            onSent={() => {
              wasSent.current = true;
            }}
            prefill={prefill}
          />
        )}
      </div>
    </dialog>
  );
}
