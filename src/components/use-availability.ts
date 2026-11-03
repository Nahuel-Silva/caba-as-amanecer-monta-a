"use client";

import { useEffect, useState } from "react";
import type { Availability } from "@/lib/availability";
import { getAvailability } from "@/lib/availability-service";
import { reservationClosedEvent } from "@/lib/reservation";

/** Trae la disponibilidad al abrir la página y al cerrar el formulario. Devuelve null mientras carga. */
export function useAvailability() {
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    let isCurrent = true;

    function load() {
      getAvailability().then((result) => {
        if (isCurrent) setAvailability(result);
      });
    }

    load();
    window.addEventListener(reservationClosedEvent, load);

    return () => {
      isCurrent = false;
      window.removeEventListener(reservationClosedEvent, load);
    };
  }, []);

  return availability;
}
