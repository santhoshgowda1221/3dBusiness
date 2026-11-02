import { REVIEWS } from "@modules/site/data"
import SectionHeading from "./section-heading"

// Hidden until real reviews are added to REVIEWS in modules/site/data.ts
export default function Reviews() {
  if (!REVIEWS.length) {
    return null
  }

  const average =
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length

  return (
    <section className="bg-grey-5 py-20">
      <div className="content-container">
        <SectionHeading
          eyebrow="What customers say"
          title={`Rated ${average.toFixed(1)} out of 5`}
          intro={`From ${REVIEWS.length} customer review${REVIEWS.length === 1 ? "" : "s"}.`}
        />
        <ul className="grid gap-4 small:grid-cols-3">
          {REVIEWS.map((r) => (
            <li
              key={`${r.name}-${r.date}`}
              className="rounded-2xl border border-grey-20 bg-white p-6"
            >
              <p aria-label={`${r.rating} out of 5`} className="text-brand-500">
                {"★".repeat(r.rating)}
                <span className="text-grey-30">
                  {"★".repeat(5 - r.rating)}
                </span>
              </p>
              <p className="mt-3 text-grey-70">{r.text}</p>
              <p className="mt-4 text-sm font-semibold text-ink">{r.name}</p>
              <p className="text-xs text-grey-50">{r.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
