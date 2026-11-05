"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePanOnHover } from "@/components/use-pan-on-hover";
import type { Review } from "@/content/reviews";
import { getApprovedReviews, submitReview } from "@/lib/reviews-service";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="review-card">
      <span aria-hidden="true" className="review-stars">{"★".repeat(review.rating)}</span>
      <span className="sr-only">Calificación: {review.rating} de 5</span>
      <h3>{review.title}</h3>
      <blockquote>“{review.quote}”</blockquote>
      <figcaption className="review-meta">
        <strong>{review.author}</strong> · {review.date.charAt(0).toUpperCase() + review.date.slice(1)}
        {" · "}
        {review.sourceUrl ? (
          <a href={review.sourceUrl} rel="noopener noreferrer" target="_blank">
            {review.sourceName}
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        ) : (
          review.sourceName
        )}
      </figcaption>
    </figure>
  );
}

/** Lista de opiniones y formulario para dejar una nueva. */
export function ReviewBoard({ reviews, canSubmit }: { reviews: Review[]; canSubmit: boolean }) {
  const [approved, setApproved] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const followMouse = usePanOnHover<HTMLDivElement>();

  useEffect(() => {
    let isCurrent = true;
    getApprovedReviews().then((result) => {
      if (isCurrent) setApproved(result);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const author = String(data.get("author")).trim();
    const title = String(data.get("title")).trim();
    const quote = String(data.get("quote")).trim();

    if (rating === 0) {
      setError("Elegí una calificación de 1 a 5 estrellas.");
      return;
    }
    if (author.length < 2 || title.length < 3 || quote.length < 10) {
      setError("Completá tu nombre, un título y un comentario de al menos 10 caracteres.");
      return;
    }

    setError("");
    setIsSending(true);
    const result = await submitReview({
      author,
      rating,
      title,
      quote,
      consent: data.get("consent") === "on",
      hp_token: String(data.get("hp_token") ?? ""),
    });
    setIsSending(false);
    if (!result.ok) {
      setError(result.error ?? "No pudimos enviar tu reseña.");
      return;
    }
    setRating(0);
    setIsFormOpen(false);
    if (result.published) setApproved(await getApprovedReviews());
    setMessage(result.published ? "¡Gracias! Tu reseña ya está publicada." : "¡Gracias por tu reseña! La vamos a revisar antes de publicarla.");
  }

  function closeForm() {
    setIsFormOpen(false);
    setRating(0);
    setError("");
  }

  return (
    <>
      {/* Tira que se desliza con el mouse (o con el dedo); las tarjetas se esfuman en los bordes. */}
      <div aria-label="Opiniones de huéspedes" className="review-strip" onMouseMove={followMouse} role="region" tabIndex={0}>
        {approved.map((review) => (
          <ReviewCard key={`${review.author}-${review.title}`} review={review} />
        ))}
        {reviews.map((review) => (
          <ReviewCard key={`${review.author}-${review.date}`} review={review} />
        ))}
      </div>

      <p aria-live="polite" className="review-message">{message}</p>

      {isFormOpen ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Dejá tu reseña</h3>
          <p className="review-form-notice">Tu reseña se publica al enviarla. Solo revisamos antes las que tienen insultos o enlaces.</p>

          <fieldset className="review-rating">
            <legend>Tu calificación</legend>
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  checked={rating === value}
                  className="sr-only"
                  name="rating"
                  onChange={() => setRating(value)}
                  type="radio"
                  value={value}
                />
                <span aria-hidden="true" className={value <= rating ? "is-active" : undefined}>★</span>
                <span className="sr-only">{value} de 5</span>
              </label>
            ))}
          </fieldset>

          <label className="review-field">
            Tu nombre
            <input autoComplete="given-name" maxLength={40} name="author" required type="text" />
          </label>
          <label className="review-field">
            Título
            <input maxLength={60} name="title" required type="text" />
          </label>
          <label className="review-field">
            Tu comentario
            <textarea maxLength={500} name="quote" required rows={4} />
          </label>
          <label className="review-consent">
            <input name="consent" required type="checkbox" />
            Acepto que mi nombre y mi opinión se publiquen en esta web.
          </label>

          {/* Campo trampa para robots: las personas no lo ven. Sin "sitio web" ni nada que el navegador autocomplete. */}
          <div aria-hidden="true" className="review-trap">
            <input
              aria-hidden="true"
              autoComplete="off"
              data-1p-ignore
              data-bwignore
              data-form-type="other"
              data-lpignore="true"
              name="hp_token"
              tabIndex={-1}
              type="text"
            />
          </div>

          {error && <p className="review-error" role="alert">{error}</p>}

          <div className="review-form-actions">
            <button className="button button-primary" disabled={isSending} type="submit">
              {isSending ? "Enviando…" : "Enviar reseña"}
            </button>
            <button className="review-cancel" onClick={closeForm} type="button">
              Cancelar
            </button>
          </div>
        </form>
      ) : canSubmit && (
        <button className="button button-primary review-open" onClick={() => setIsFormOpen(true)} type="button">
          Dejar una reseña
        </button>
      )}
    </>
  );
}
