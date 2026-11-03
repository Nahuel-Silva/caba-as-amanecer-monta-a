"use client";

import { useEffect, useRef, useState } from "react";
import { ReservationForm } from "@/components/reservation-form";
import { openReservationEvent, reservationClosedEvent, type ReservationPrefill } from "@/lib/reservation";

/** Panel del formulario de reserva. Lo abre la barra de reserva con los datos ya elegidos. */
export function ReservationDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formVersion, setFormVersion] = useState(0);
  const [prefill, setPrefill] = useState<ReservationPrefill | null>(null);
  const wasSent = useRef(false);

  useEffect(() => {
    function openWithData(event: Event) {
      setPrefill((event as CustomEvent<ReservationPrefill>).detail);
      dialogRef.current?.showModal();
    }

    window.addEventListener(openReservationEvent, openWithData);
    return () => window.removeEventListener(openReservationEvent, openWithData);
  }, []);

  function close() {
    dialogRef.current?.close();
  }

  // Al cerrar después de enviar, el formulario vuelve a quedar vacío. Si no se envió, conserva lo escrito.
  function handleClose() {
    window.dispatchEvent(new Event(reservationClosedEvent));
    if (!wasSent.current) return;
    wasSent.current = false;
    setPrefill(null);
    setFormVersion((version) => version + 1);
  }

  return (
    <dialog
      aria-labelledby="reservation-dialog-title"
      className="reservation-dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onClose={handleClose}
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
