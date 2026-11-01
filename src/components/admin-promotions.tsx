"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Promotion } from "@/lib/promotion";

const maxImageWidth = 1400;

/** Achica la foto en el navegador y la convierte a JPEG antes de enviarla. */
async function compressImage(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxImageWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

async function sendPromotion(body: Record<string, unknown>) {
  const response = await fetch("/api/admin/promociones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as { error?: string };
  return response.ok ? "" : (result.error ?? "No pudimos guardar el cambio.");
}

function PromotionForm({ promotion, onDone }: { promotion: Promotion | null; onDone: () => void }) {
  const [preview, setPreview] = useState(promotion?.image?.src ?? "");
  const [newImage, setNewImage] = useState("");
  const [isRemoved, setIsRemoved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      setNewImage(dataUrl);
      setPreview(dataUrl);
      setIsRemoved(false);
      setError("");
    } catch {
      setError("No pudimos leer esa foto. Probá con un archivo JPG o PNG.");
    }
  }

  function removeImage() {
    setNewImage("");
    setPreview("");
    setIsRemoved(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    setIsSaving(true);
    const message = await sendPromotion({
      ...fields,
      action: "save",
      id: promotion?.id,
      details: String(fields.details).split("\n"),
      imageBase64: newImage.split(",")[1] ?? "",
      removeImage: isRemoved,
    });
    setIsSaving(false);
    if (message) setError(message);
    else onDone();
  }

  return (
    <form className="admin-promotion-form" onSubmit={handleSubmit}>
      <h2>{promotion ? "Editar promoción" : "Nueva promoción"}</h2>
      <label className="admin-wide">
        Título
        <input defaultValue={promotion?.title} maxLength={90} name="title" required type="text" />
      </label>
      <label className="admin-wide">
        Descripción
        <textarea defaultValue={promotion?.description} maxLength={500} name="description" required rows={3} />
      </label>
      <label>
        Descuento o beneficio
        <input defaultValue={promotion?.discount} maxLength={24} name="discount" placeholder="15% OFF" type="text" />
      </label>
      <label>
        Vigencia
        <input defaultValue={promotion?.validity} maxLength={80} name="validity" placeholder="Hasta el 30 de mayo" type="text" />
      </label>
      <label className="admin-wide">
        Qué incluye (uno por renglón)
        <textarea defaultValue={promotion?.details.join("\n")} name="details" rows={4} />
      </label>
      <label>
        Condiciones
        <input defaultValue={promotion?.conditions} maxLength={400} name="conditions" placeholder="Mínimo 3 noches" type="text" />
      </label>
      <label>
        Código
        <input defaultValue={promotion?.code} maxLength={30} name="code" placeholder="OTONO" type="text" />
      </label>
      <label>
        Foto
        <input accept="image/jpeg,image/png,image/webp" onChange={chooseImage} type="file" />
      </label>
      <label>
        Qué se ve en la foto
        <input defaultValue={promotion?.image?.alt} maxLength={160} name="imageAlt" type="text" />
      </label>
      {preview && (
        <div className="admin-wide admin-promotion-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de un archivo elegido en el navegador */}
          <img alt="Vista previa de la foto" src={preview} />
          <button className="admin-link" onClick={removeImage} type="button">Quitar foto</button>
        </div>
      )}
      {error && <p className="admin-error admin-wide" role="alert">{error}</p>}
      <div className="admin-actions admin-wide">
        <button className="button button-primary" disabled={isSaving} type="submit">
          {isSaving ? "Guardando…" : "Guardar"}
        </button>
        <button className="admin-link" onClick={onDone} type="button">Cancelar</button>
      </div>
    </form>
  );
}

/** Pestaña de promociones del panel. */
export function AdminPromotions({ promotions, onChange }: { promotions: Promotion[]; onChange: () => Promise<void> }) {
  const [editing, setEditing] = useState<Promotion | "new" | null>(null);
  const [error, setError] = useState("");

  async function run(body: Record<string, unknown>) {
    setError(await sendPromotion(body));
    await onChange();
  }

  async function remove(promotion: Promotion) {
    if (window.confirm(`¿Borrar "${promotion.title}"? No se puede deshacer.`)) await run({ action: "delete", id: promotion.id });
  }

  if (editing) {
    return (
      <PromotionForm
        key={editing === "new" ? "new" : editing.id}
        onDone={() => {
          setEditing(null);
          void onChange();
        }}
        promotion={editing === "new" ? null : editing}
      />
    );
  }

  return (
    <>
      <button className="button button-primary admin-new" onClick={() => setEditing("new")} type="button">Nueva promoción</button>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {promotions.length === 0 && <p>Todavía no hay promociones.</p>}
      <div className="admin-list">
        {promotions.map((promotion) => (
          <article className={`admin-card ${promotion.active ? "is-approved" : "is-rejected"}`} key={promotion.id}>
            <div className="admin-card-head">
              <h3>{promotion.title}</h3>
              <span className="admin-status">{promotion.active ? "Visible" : "Oculta"}</span>
            </div>
            <p className="admin-message">{promotion.description}</p>
            {(promotion.discount || promotion.validity) && <p>{[promotion.discount, promotion.validity].filter(Boolean).join(" · ")}</p>}
            <div className="admin-actions">
              <button className="button button-primary" onClick={() => setEditing(promotion)} type="button">Editar</button>
              <button className="admin-link" onClick={() => run({ action: "set-active", id: promotion.id, active: !promotion.active })} type="button">
                {promotion.active ? "Ocultar" : "Mostrar"}
              </button>
              <button className="admin-link" onClick={() => remove(promotion)} type="button">Borrar</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
