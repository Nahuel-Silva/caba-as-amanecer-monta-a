"use client";

import { useEffect, useState } from "react";
import type { Availability } from "@/lib/availability";
import { getAvailability } from "@/lib/availability-service";

/** Trae la disponibilidad al abrir la página. Devuelve null mientras carga. */
export function useAvailability() {
  const [availability, setAvailability] = useState<Availability | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getAvailability().then((result) => {
      if (isCurrent) setAvailability(result);
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  return availability;
}
