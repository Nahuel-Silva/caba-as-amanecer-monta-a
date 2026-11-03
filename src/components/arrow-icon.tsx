/**
 * Flecha diagonal dibujada. El carácter "↗" se muestra como emoji en iPhone,
 * por eso los botones usan este ícono, que hereda el color y tamaño del texto.
 */
export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
