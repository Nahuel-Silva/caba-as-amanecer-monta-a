"use client";

import { useEffect, useRef, useState } from "react";
import { isSeason, seasonForDate, type Season } from "@/lib/season";
import "./seasonal-effects.css";

/*
 * Decoración de fondo según la estación del año (hemisferio sur):
 * primavera, pétalos; verano, haces de luz de sol; otoño, hojas de álamo; invierno, copos de nieve.
 * Cambia sola con la fecha de Mendoza. Para verla en otra estación: ?estacion=invierno (o verano, otono, primavera).
 * No intercepta clics, se pausa con la pestaña oculta y respeta "reducir movimiento".
 */

type Particle = { x: number; y: number; size: number; speed: number; sway: number; phase: number; spin: number; angle: number; color: string };

const palettes: Record<Exclude<Season, "verano">, string[]> = {
  primavera: ["#f2b8c6", "#eea5b8", "#f7d3dc", "#f0c4a8"],
  otono: ["#d9a33f", "#c9792f", "#b55a2c", "#e0b84f"],
  invierno: ["#b9c9d8", "#a7bacd", "#c8d5e2"],
};

function drawParticle(context: CanvasRenderingContext2D, season: Exclude<Season, "verano">, particle: Particle) {
  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.angle);
  context.fillStyle = particle.color;
  context.strokeStyle = particle.color;
  const size = particle.size;

  if (season === "invierno") {
    // Copo de seis brazos.
    context.lineWidth = Math.max(1, size / 7);
    context.lineCap = "round";
    for (let arm = 0; arm < 6; arm++) {
      context.rotate(Math.PI / 3);
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(0, -size / 2);
      context.moveTo(0, -size / 3.2);
      context.lineTo(size / 7, -size / 2.4);
      context.moveTo(0, -size / 3.2);
      context.lineTo(-size / 7, -size / 2.4);
      context.stroke();
    }
  } else if (season === "otono") {
    // Hoja con nervadura central.
    context.beginPath();
    context.moveTo(0, -size / 2);
    context.quadraticCurveTo(size / 2.2, -size / 8, 0, size / 2);
    context.quadraticCurveTo(-size / 2.2, -size / 8, 0, -size / 2);
    context.fill();
    context.strokeStyle = "rgb(120 70 30 / 45%)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, -size / 2.4);
    context.lineTo(0, size / 1.7);
    context.stroke();
  } else {
    // Pétalo.
    context.beginPath();
    context.ellipse(0, 0, size / 3.4, size / 2, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function FallingParticles({ season }: { season: Exclude<Season, "verano"> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame: number | null = null;
    let last = 0;
    const colors = palettes[season];
    const random = (min: number, max: number) => min + Math.random() * (max - min);

    function createParticle(startAnywhere: boolean): Particle {
      const isSnow = season === "invierno";
      return {
        x: random(0, width),
        y: startAnywhere ? random(-20, height) : random(-60, -20),
        size: isSnow ? random(10, 18) : random(12, 20),
        speed: isSnow ? random(18, 38) : random(24, 46),
        sway: random(12, 34),
        phase: random(0, Math.PI * 2),
        spin: random(-0.9, 0.9),
        angle: random(0, Math.PI * 2),
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * ratio);
      canvas!.height = Math.round(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Como caen detrás del contenido, solo se ven en los espacios libres: unas 32 a 40 en computadora y 14 en el celular.
      const count = Math.round(Math.min(40, Math.max(14, width / 40)));
      particles = Array.from({ length: count }, (_, index) => particles[index] ?? createParticle(true));
    }

    function step(time: number) {
      const seconds = last ? Math.min((time - last) / 1000, 0.05) : 0;
      last = time;
      context!.clearRect(0, 0, width, height);
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index];
        particle.y += particle.speed * seconds;
        particle.phase += seconds * 0.9;
        particle.angle += particle.spin * seconds;
        const x = particle.x + Math.sin(particle.phase) * particle.sway;
        if (particle.y > height + 30) particles[index] = createParticle(false);
        drawParticle(context!, season, { ...particle, x });
      }
      frame = requestAnimationFrame(step);
    }

    function start() {
      if (frame === null && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(step);
      }
    }

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    }

    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    start();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [season]);

  return <canvas className="season-canvas" ref={canvasRef} />;
}

export function SeasonalEffects() {
  const [state, setState] = useState<{ season: Season; reducedMotion: boolean } | null>(null);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("estacion");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Se decide en el navegador: las páginas se generan una vez y la estación tiene que ser la del día de la visita.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ season: isSeason(requested) ? requested : seasonForDate(), reducedMotion });
  }, []);

  if (!state) return null;

  return (
    <div aria-hidden="true" className={`season-layer season-${state.season}`}>
      {state.season === "verano" ? (
        <SunBeams />
      ) : (
        !state.reducedMotion && <FallingParticles season={state.season} />
      )}
    </div>
  );
}

/**
 * Haces de luz, repartidos a lo ancho de la pantalla: dónde empiezan (left y top, en % de la pantalla),
 * cuánto bajan (length, en % del alto), su ancho y su ritmo. Fijos, para que se vean igual en cada visita.
 */
const beams = [
  { left: 2, top: -8, length: 70, width: 58, delay: 0, duration: 16 },
  { left: 36, top: -8, length: 78, width: 64, delay: -6, duration: 19 },
  { left: 46, top: 32, length: 22, width: 26, delay: -11, duration: 14 },
  { left: 68, top: 8, length: 45, width: 44, delay: -3, duration: 17 },
  { left: 76, top: -8, length: 10, width: 18, delay: -8, duration: 15 },
  { left: 79, top: 2, length: 66, width: 72, delay: -13, duration: 21 },
  { left: 93, top: 70, length: 22, width: 46, delay: -5, duration: 18 },
];

/**
 * Haces de luz de sol: franjas paralelas y separadas que bajan en diagonal, como el sol entrando entre los álamos.
 * Cada una cae despacio a lo largo de su diagonal, aparece y se desvanece, a su propio ritmo (solo con CSS).
 */
function SunBeams() {
  return (
    <div className="season-beams">
      {beams.map((beam) => (
        <span
          className="season-beam"
          key={`${beam.left}-${beam.top}`}
          style={{
            left: `${beam.left}%`,
            top: `${beam.top}%`,
            height: `${beam.length * 1.25}vh`,
            width: `${beam.width * 1.4}px`,
            animationDelay: `${beam.delay}s`,
            animationDuration: `${beam.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
