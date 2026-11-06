"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { ConfirmRequest, Notice } from "@/components/admin-ui";
import { PromotionCard } from "@/components/promotion-card";
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
  try {
    const response = await fetch("/api/admin/promociones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as { error?: string };
    return response.ok ? "" : (result.error ?? "No pudimos guardar el cambio. Probá de nuevo.");
  } catch {
    return "No hay conexión a internet. Revisá la conexión y probá de nuevo.";
  }
}

type Draft = { title: string; description: string; discount: string; validity: string; imageAlt: string };

/** Arma una promoción de muestra con lo escrito hasta ahora, para la vista previa. */
function previewPromotion(draft: Draft, image: string): Promotion {
  return {
    id: 0,
    slug: "vista-previa",
    title: draft.title.trim() || "Título de la promoción",
    description: draft.description.trim() || "Acá va la descripción.",
    discount: draft.discount.trim() || undefined,
    validity: draft.validity.trim() || undefined,
    details: [],
    image: image ? { src: image, alt: draft.imageAlt } : undefined,
    active: true,
  };
}

/** Texto de ayuda debajo de un campo. */
function Hint({ children }: { children: string }) {
  return <small className="admin-hint">{children}</small>;
}

function PromotionForm({ promotion, onDone, onSaved }: { promotion: Promotion | null; onDone: () => void; onSaved: () => void }) {
  const [preview, setPreview] = useState(promotion?.image?.src ?? "");
  const [newImage, setNewImage] = useState("");
  const [isRemoved, setIsRemoved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<Draft>({
    title: promotion?.title ?? "",
    description: promotion?.description ?? "",
    discount: promotion?.discount ?? "",
    validity: promotion?.validity ?? "",
    imageAlt: promotion?.image?.alt ?? "",
  });

  function updateDraft(event: FormEvent<HTMLFormElement>) {
    const fields = new FormData(event.currentTarget);
    const read = (name: keyof Draft) => String(fields.get(name) ?? "");
    setDraft({ title: read("title"), description: read("description"), discount: read("discount"), validity: read("validity"), imageAlt: read("imageAlt") });
  }

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
    else onSaved();
  }

  return (
    <div className="admin-promotion-editor">
      <form className="admin-promotion-form" onInput={updateDraft} onSubmit={handleSubmit}>
        <h2>{promotion ? "Cambiar la promoción" : "Nueva promoción"}</h2>
        <p className="admin-wide admin-form-intro">Solo el título y la descripción son obligatorios. Lo demás podés dejarlo vacío.</p>
        <label className="admin-wide">
          Título (obligatorio)
          <input defaultValue={promotion?.title} maxLength={90} name="title" required type="text" />
          <Hint>El nombre de la promoción. Por ejemplo: Escapada de otoño.</Hint>
        </label>
        <label className="admin-wide">
          Descripción (obligatoria)
          <textarea defaultValue={promotion?.description} maxLength={500} name="description" required rows={3} />
          <Hint>Contá en pocas palabras de qué se trata.</Hint>
        </label>
        <label>
          Descuento o beneficio
          <input defaultValue={promotion?.discount} maxLength={24} name="discount" placeholder="15% OFF" type="text" />
          <Hint>Aparece grande sobre la foto. Por ejemplo: 15% OFF.</Hint>
        </label>
        <label>
          Hasta cuándo vale
          <input defaultValue={promotion?.validity} maxLength={80} name="validity" placeholder="Hasta el 30 de mayo" type="text" />
          <Hint>Por ejemplo: Hasta el 30 de mayo.</Hint>
        </label>
        <label className="admin-wide">
          Qué incluye
          <textarea defaultValue={promotion?.details.join("\n")} name="details" rows={4} />
          <Hint>Escribí una cosa por renglón. Para pasar al renglón siguiente, apretá Enter.</Hint>
        </label>
        <label>
          Condiciones
          <input defaultValue={promotion?.conditions} maxLength={400} name="conditions" placeholder="Mínimo 3 noches" type="text" />
          <Hint>Por ejemplo: Mínimo 3 noches.</Hint>
        </label>
        <label>
          Código
          <input defaultValue={promotion?.code} maxLength={30} name="code" placeholder="OTONO" type="text" />
          <Hint>Una palabra que el huésped menciona al consultar. Es opcional.</Hint>
        </label>
        <label>
          Foto
          <input accept="image/jpeg,image/png,image/webp" onChange={chooseImage} type="file" />
          <Hint>Elegí una foto de la computadora o del celular.</Hint>
        </label>
        <label>
          Qué se ve en la foto
          <input defaultValue={promotion?.image?.alt} maxLength={160} name="imageAlt" type="text" />
          <Hint>Una frase corta para personas que no ven bien. Por ejemplo: La cabaña Payunia con nieve.</Hint>
        </label>
        {preview && (
          <div className="admin-wide admin-promotion-preview">
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa de un archivo elegido en el navegador */}
            <img alt="Vista previa de la foto" src={preview} />
            <button className="admin-button is-secondary" onClick={removeImage} type="button">Quitar foto</button>
          </div>
        )}
        {error && <p className="admin-error admin-wide" role="alert">{error}</p>}
        <div className="admin-actions admin-wide">
          <button className="admin-button is-primary" disabled={isSaving} type="submit">
            {isSaving ? "Guardando…" : "Guardar promoción"}
          </button>
          <button className="admin-button is-secondary" onClick={onDone} type="button">Volver sin guardar</button>
        </div>
      </form>
      <aside className="admin-promotion-live">
        <p className="admin-promotion-live-title">Así se va a ver en la web</p>
        {/* "inert": es solo una muestra, sus enlaces no se pueden tocar. */}
        <div inert>
          <PromotionCard promotion={previewPromotion(draft, preview)} />
        </div>
        <p className="admin-hint">Se actualiza mientras escribís. Los cambios se ven en la web recién cuando tocás Guardar promoción.</p>
      </aside>
    </div>
  );
}

type AdminPromotionsProps = {
  promotions: Promotion[];
  onChange: () => Promise<void>;
  ask: (request: ConfirmRequest) => void;
  onNotice: (notice: Notice) => void;
};

/** Sección de promociones del panel. */
export function AdminPromotions({ promotions, onChange, ask, onNotice }: AdminPromotionsProps) {
  const [editing, setEditing] = useState<Promotion | "new" | null>(null);

  async function run(body: Record<string, unknown>, successText: string) {
    const error = await sendPromotion(body);
    onNotice(error ? { kind: "error", text: error } : { kind: "success", text: successText });
    await onChange();
  }

  function toggle(promotion: Promotion) {
    const willShow = !promotion.active;
    ask({
      title: willShow ? "¿Mostrar esta promoción en la web?" : "¿Ocultar esta promoción?",
      text: (
        <p>
          <strong>{promotion.title}</strong>
          <br />
          {willShow ? "Va a aparecer en la página Promociones." : "Deja de verse en la web, pero queda guardada acá para volver a mostrarla."}
        </p>
      ),
      confirmLabel: willShow ? "Sí, mostrar" : "Sí, ocultar",
      onConfirm: () => run({ action: "set-active", id: promotion.id, active: willShow }, willShow ? "Listo, la promoción ya se ve en la web." : "Listo, la promoción quedó oculta."),
    });
  }

  function remove(promotion: Promotion) {
    ask({
      title: "¿Borrar esta promoción?",
      text: (
        <p>
          <strong>{promotion.title}</strong>
          <br />
          Se borra para siempre y no se puede recuperar. Si solo querés que no se vea, usá Ocultar.
        </p>
      ),
      confirmLabel: "Sí, borrar para siempre",
      isDanger: true,
      onConfirm: () => run({ action: "delete", id: promotion.id }, "Listo, la promoción quedó borrada."),
    });
  }

  if (editing) {
    return (
      <PromotionForm
        key={editing === "new" ? "new" : editing.id}
        onDone={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          onNotice({ kind: "success", text: "Listo, la promoción quedó guardada." });
          void onChange();
        }}
        promotion={editing === "new" ? null : editing}
      />
    );
  }

  return (
    <>
      <button className="admin-button is-primary admin-new" onClick={() => setEditing("new")} type="button">+ Crear una promoción nueva</button>
      {promotions.length === 0 && <p className="admin-empty">Todavía no hay promociones.</p>}
      <div className="admin-list">
        {promotions.map((promotion) => (
          <article className={`admin-card ${promotion.active ? "is-approved" : "is-rejected"}`} key={promotion.id}>
            <div className="admin-card-head">
              <h3>{promotion.title}</h3>
              <span className="admin-status">{promotion.active ? "Se ve en la web" : "Oculta"}</span>
            </div>
            <p className="admin-message">{promotion.description}</p>
            {(promotion.discount || promotion.validity) && <p>{[promotion.discount, promotion.validity].filter(Boolean).join(" · ")}</p>}
            <div className="admin-actions">
              <button className="admin-button is-primary" onClick={() => setEditing(promotion)} type="button">Cambiar</button>
              <button className="admin-button is-secondary" onClick={() => toggle(promotion)} type="button">
                {promotion.active ? "Ocultar" : "Mostrar en la web"}
              </button>
              <button className="admin-link is-danger" onClick={() => remove(promotion)} type="button">Borrar</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
