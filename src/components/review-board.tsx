"use client";

import { useState, type FormEvent } from "react";
import type { Review } from "@/content/reviews";
import { submitReview } from "@/lib/reviews-service";

function ReviewCard({ review, isPreview = false }: { review: Review; isPreview?: boolean }) {
  return (
    <figure className="review-card">
      <span aria-hidden="true" className="review-stars">{"★".repeat(review.rating)}</span>
      <span className="sr-only">Puntaje: {review.rating} de 5</span>
      <h3>{review.title}</h3>
      <blockquote>“{review.quote}”</blockquote>
      <figcaption className="review-meta">
        <strong>{review.author}</strong> · {review.date}
        {review.sourceUrl && (
          <>
            {" · "}
            <a href={review.sourceUrl} rel="noopener noreferrer" target="_blank">
              {review.sourceName}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </>
        )}
      </figcaption>
      {isPreview && <p className="review-preview-label">Prueba: solo se ve en este navegador</p>}
    </figure>
  );
}

/** Lista de opiniones y formulario para dejar una nueva. */
export function ReviewBoard({ reviews }: { reviews: Review[] }) {
  const [submitted, setSubmitted] = useState<Review[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const author = String(data.get("author")).trim();
    const title = String(data.get("title")).trim();
    const quote = String(data.get("quote")).trim();

    if (rating === 0) {
      setError("Elegí un puntaje de 1 a 5 estrellas.");
      return;
    }
    if (author.length < 2 || title.length < 3 || quote.length < 10) {
      setError("Completá tu nombre, un título y un comentario de al menos 10 caracteres.");
      return;
    }

    setError("");
    setIsSending(true);
    const review = await submitReview({ author, rating, title, quote });
    setSubmitted((current) => [review, ...current]);
    setIsSending(false);
    setRating(0);
    setIsFormOpen(false);
    setMessage("¡Gracias! Esta función está en prueba: tu reseña no se publicó y desaparece al recargar la página.");
  }

  function closeForm() {
    setIsFormOpen(false);
    setRating(0);
    setError("");
  }

  return (
    <>
      <div className="review-grid">
        {submitted.map((review, index) => (
          <ReviewCard isPreview key={submitted.length - index} review={review} />
        ))}
        {reviews.map((review) => (
          <ReviewCard key={`${review.author}-${review.date}`} review={review} />
        ))}
      </div>

      <p aria-live="polite" className="review-message">{message}</p>

      {isFormOpen ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Dejá tu reseña</h3>
          <p className="review-form-notice">Función en prueba: por ahora las reseñas no se guardan ni se publican.</p>

          <fieldset className="review-rating">
            <legend>Tu puntaje</legend>
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
      ) : (
        <button className="button button-primary review-open" onClick={() => setIsFormOpen(true)} type="button">
          Dejar una reseña
        </button>
      )}
    </>
  );
}
