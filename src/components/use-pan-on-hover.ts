"use client";

import { useEffect, useRef, type MouseEvent } from "react";

/**
 * Devuelve el manejador de onMouseMove que desliza una tira horizontal siguiendo el mouse: con el puntero a la izquierda se ve el comienzo,
 * a la derecha el final. Los extremos (10 % de cada lado) quedan como zona de descanso.
 * Con "reducir movimiento" activado salta directo, sin animación.
 */
export function usePanOnHover<T extends HTMLElement>() {
  const strip = useRef<T | null>(null);
  const frame = useRef<number | null>(null);
  const target = useRef(0);
  const position = useRef(0);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  return function followMouse(event: MouseEvent<T>) {
    const element = event.currentTarget;
    strip.current = element;
    const bounds = element.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, ((event.clientX - bounds.left) / bounds.width - 0.1) / 0.8));
    target.current = ratio * (element.scrollWidth - element.clientWidth);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.scrollLeft = target.current;
      return;
    }

    if (frame.current !== null) return;
    position.current = element.scrollLeft;

    const step = () => {
      const distance = target.current - position.current;
      position.current = Math.abs(distance) < 0.5 ? target.current : position.current + distance * 0.1;
      if (strip.current) strip.current.scrollLeft = position.current;
      frame.current = position.current === target.current ? null : requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };
}
