"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ReservationForm } from "@/components/reservation-form";
import { openReservationEvent, type ReservationPrefill } from "@/lib/reservation";

type CabinOption = { slug: string; name: string };

/** Ícono fijo de mail que despliega el formulario de solicitud de reserva. */
export function ReservationFloat({ cabins }: { cabins: CabinOption[] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formVersion, setFormVersion] = useState(0);
  const wasSent = useRef(false);
  const [prefill, setPrefill] = useState<ReservationPrefill | null>(null);

  // La barra de reserva abre este mismo formulario con los datos ya elegidos.
  useEffect(() => {
    function openWithData(event: Event) {
      setPrefill((event as CustomEvent<ReservationPrefill>).detail);
      setFormVersion((version) => version + 1);
      dialogRef.current?.showModal();
    }

    window.addEventListener(openReservationEvent, openWithData);
    return () => window.removeEventListener(openReservationEvent, openWithData);
  }, []);

  const currentCabin = cabins.find((cabin) => pathname === `/cabanas/${cabin.slug}`);

  function close() {
    dialogRef.current?.close();
  }

  // Al cerrar después de enviar, el formulario vuelve a quedar vacío. Si no se envió, conserva lo escrito.
  function handleClose() {
    if (!wasSent.current) return;
    wasSent.current = false;
    setPrefill(null);
    setFormVersion((version) => version + 1);
  }

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-label="Solicitar reserva por mail"
        className="mail-float"
        onClick={() => dialogRef.current?.showModal()}
        type="button"
      >
        <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect height="16" rx="2.5" width="20" x="2" y="4" />
          <path d="m3 6.5 9 6.5 9-6.5" />
        </svg>
      </button>

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
              <p>Te respondemos con la disponibilidad y la tarifa.</p>
            </div>
            <button aria-label="Cerrar" className="reservation-dialog-close" onClick={close} type="button">×</button>
          </div>
          <ReservationForm
            cabins={cabins}
            defaultCabin={currentCabin?.name}
            key={`${formVersion}-${currentCabin?.slug ?? "general"}`}
            prefill={prefill}
            onSent={() => {
              wasSent.current = true;
            }}
          />
        </div>
      </dialog>
    </>
  );
}
