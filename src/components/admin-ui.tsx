"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Pregunta antes de una acción importante. `onConfirm` hace el cambio; mientras tanto los botones quedan deshabilitados. */
export type ConfirmRequest = {
  title: string;
  text: ReactNode;
  confirmLabel: string;
  /** Acciones que borran o cancelan: el botón principal se muestra en rojo. */
  isDanger?: boolean;
  onConfirm: () => Promise<void>;
};

export function ConfirmDialog({ request, onClose }: { request: ConfirmRequest | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (request && !dialog.open) dialog.showModal();
    if (!request && dialog.open) dialog.close();
  }, [request]);

  async function confirm() {
    if (!request) return;
    setIsWorking(true);
    await request.onConfirm();
    setIsWorking(false);
    onClose();
  }

  return (
    <dialog aria-labelledby="admin-confirm-title" className="admin-confirm" onClose={onClose} ref={dialogRef}>
      {request && (
        <>
          <h2 id="admin-confirm-title">{request.title}</h2>
          <div className="admin-confirm-text">{request.text}</div>
          <div className="admin-confirm-actions">
            <button className={`admin-button ${request.isDanger ? "is-danger" : "is-primary"}`} disabled={isWorking} onClick={confirm} type="button">
              {isWorking ? "Guardando…" : request.confirmLabel}
            </button>
            <button className="admin-button is-secondary" disabled={isWorking} onClick={onClose} type="button">
              No, volver
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}

/** Aviso que confirma lo que pasó ("Listo, …") o explica un error. Se cierra solo a los 8 segundos. */
export type Notice = { kind: "success" | "error"; text: string };

export function NoticeBar({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(onClose, 8000);
    return () => window.clearTimeout(timer);
  }, [notice, onClose]);

  return (
    <div aria-live="polite" className="admin-notice-slot" role="status">
      {notice && (
        <div className={`admin-notice is-${notice.kind}`}>
          <span aria-hidden="true" className="admin-notice-icon">{notice.kind === "success" ? "✓" : "!"}</span>
          <p>{notice.text}</p>
          <button aria-label="Cerrar aviso" className="admin-notice-close" onClick={onClose} type="button">×</button>
        </div>
      )}
    </div>
  );
}

/** Recuadro corto que explica para qué sirve cada sección. */
export function HelpBox({ children }: { children: ReactNode }) {
  return (
    <aside className="admin-help">
      <span aria-hidden="true" className="admin-help-icon">i</span>
      <div>{children}</div>
    </aside>
  );
}
