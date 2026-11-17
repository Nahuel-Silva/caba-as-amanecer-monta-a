"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

const languageNames: Record<Locale, string> = { es: "español", pt: "portugués", en: "inglés" };

/** Texto final de un mensaje al huésped: el que se le manda por mail y por WhatsApp. */
export type MessageDraft = { current: string };

type MessageEditorProps = {
  /** Mensaje armado en español, como lo ve el propietario. */
  spanish: string;
  /** El mismo mensaje armado en el idioma del huésped (traducción fija, sin costo). */
  translated: string;
  locale: Locale;
  /** Se actualiza con el texto que se va a mandar. */
  draftRef: MessageDraft;
};

/**
 * Mensaje al huésped que se puede modificar antes de mandarlo.
 * Si el huésped reservó en otro idioma, al lado se ve "Así lo recibe": si se cambia el español,
 * se traduce solo con DeepL; también se puede corregir la traducción a mano.
 */
export function MessageEditor({ spanish, translated, locale, draftRef }: MessageEditorProps) {
  const [text, setText] = useState(spanish);
  const [output, setOutput] = useState(translated);
  const [status, setStatus] = useState<"" | "translating" | "error">("");
  const [statusText, setStatusText] = useState("");
  const isOtherLanguage = locale !== "es";
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    draftRef.current = isOtherLanguage ? output : text;
  }, [draftRef, isOtherLanguage, output, text]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function changeSpanish(value: string) {
    setText(value);
    if (!isOtherLanguage) return;
    if (timer.current) clearTimeout(timer.current);
    // Si se vuelve al texto original, se usa la traducción fija.
    if (value.trim() === spanish.trim()) {
      setOutput(translated);
      setStatus("");
      return;
    }
    // Se traduce cuando se deja de escribir por un momento.
    timer.current = setTimeout(async () => {
      setStatus("translating");
      try {
        const response = await fetch("/api/admin/datos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "translate", text: value, to: locale }),
        });
        const result = (await response.json()) as { text?: string; error?: string };
        if (response.ok && result.text) {
          setOutput(result.text);
          setStatus("");
        } else {
          setStatus("error");
          setStatusText(result.error ?? "No se pudo traducir.");
        }
      } catch {
        setStatus("error");
        setStatusText("No hay conexión a internet.");
      }
    }, 900);
  }

  return (
    <span className={`admin-message-editor ${isOtherLanguage ? "has-translation" : ""}`}>
      <label>
        {isOtherLanguage ? "El mensaje (en español)" : "El mensaje"}
        <textarea onChange={(event) => changeSpanish(event.target.value)} rows={9} value={text} />
        <small className="admin-hint">Podés cambiar lo que quieras antes de mandarlo.</small>
      </label>
      {isOtherLanguage && (
        <label>
          Así lo recibe (en {languageNames[locale]})
          <textarea onChange={(event) => setOutput(event.target.value)} rows={9} value={output} />
          <small className={`admin-hint ${status === "error" ? "is-error" : ""}`} role="status">
            {status === "translating"
              ? "Traduciendo…"
              : status === "error"
                ? `${statusText} Corregí la traducción a mano o volvé al texto original.`
                : "Se traduce solo cuando cambiás el español. También podés corregirlo acá."}
          </small>
        </label>
      )}
    </span>
  );
}
