"use client";

import "./baby-toggle.css";

/** Botón para avisar que viajan con un bebé. */
export function BabyToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button aria-pressed={checked} className="baby-toggle" onClick={() => onChange(!checked)} type="button">
      <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="13" r="8.5" />
        <path d="M12 4.5c-1.6 0-2.6-.9-2.6-2 0 0 1 .7 2.6.7" />
        <path d="M8.6 12h.01M15.4 12h.01" strokeWidth="2.4" />
        <path d="M9.2 16.1c1.7 1.4 3.9 1.4 5.6 0" />
      </svg>
      <span>{checked ? "Con bebé" : "¿Con bebé?"}</span>
    </button>
  );
}
