import { ReviewBoard } from "@/components/review-board";
import { getRatingSummaries, getRatingsCheckedAt, getReviews } from "@/lib/content";
import "./reviews-section.css";

/** Opiniones reales de huéspedes y formulario para dejar una nueva. */
export function ReviewsSection() {
  const reviews = getReviews();
  const summaries = getRatingSummaries();

  return (
    <section aria-labelledby="reviews-title" className="section">
      <div className="wrap">
        <p className="eyebrow">Opiniones</p>
        <h2 className="section-title" id="reviews-title">Lo que dicen quienes nos visitaron.</h2>
        <ul className="review-summaries">
          {summaries.map((summary) => (
            <li key={summary.sourceName}>
              <strong>{summary.score}</strong> en{" "}
              <a href={summary.sourceUrl} rel="noopener noreferrer" target="_blank">
                {summary.sourceName}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>{" "}
              ({summary.count} opiniones)
            </li>
          ))}
        </ul>
        <ReviewBoard reviews={reviews} />
        <p className="review-note">Calificaciones consultadas en {getRatingsCheckedAt()}. Las opiniones son de huéspedes y pertenecen a cada sitio.</p>
      </div>
    </section>
  );
}
