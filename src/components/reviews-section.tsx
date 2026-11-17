import { ReviewBoard } from "@/components/review-board";
import type { Locale } from "@/i18n/config";
import { formatMonthYear } from "@/i18n/format";
import { ui } from "@/i18n/ui";
import { getRatingSummaries, getRatingsCheckedAt, getReviews } from "@/lib/content";
import { isDatabaseConfigured } from "@/lib/db";
import "./reviews-section.css";

/** Opiniones reales de huéspedes y formulario para dejar una nueva. Las opiniones se muestran tal cual se escribieron. */
export function ReviewsSection({ locale = "es" }: { locale?: Locale }) {
  const t = ui[locale];
  const reviews = getReviews();
  const summaries = getRatingSummaries();

  return (
    <section aria-labelledby="reviews-title" className="section reviews-section">
      <div className="wrap">
        <p className="eyebrow">{t.reviews.eyebrow}</p>
        <h2 className="section-title" id="reviews-title">{t.reviews.title}</h2>
        <ul className="review-summaries">
          {summaries.map((summary) => (
            <li key={summary.sourceName}>
              <strong>{summary.score}</strong> {t.reviews.summaryScore}{" "}
              <a href={summary.sourceUrl} rel="noopener noreferrer" target="_blank">
                {summary.sourceName}
                <span className="sr-only">{t.newTab}</span>
              </a>{" "}
              {t.reviews.summaryCount(summary.count)}
            </li>
          ))}
        </ul>
        <ReviewBoard canSubmit={isDatabaseConfigured} reviews={reviews} />
        <p className="review-note">
          {t.reviews.note(locale === "en" ? formatMonthYear(getRatingsCheckedAt(), locale) : formatMonthYear(getRatingsCheckedAt(), locale).toLowerCase())}
          {t.reviews.originalLanguage && ` ${t.reviews.originalLanguage}`}
        </p>
      </div>
    </section>
  );
}
