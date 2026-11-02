import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SERVICES } from "@modules/site/data"
import SectionHeading from "./section-heading"

export default function ServicesGrid() {
  return (
    <section className="content-container py-20">
      <SectionHeading
        eyebrow="What we do"
        title="One workshop, many kinds of work"
        intro="From a single prototype to a production batch, for students, startups and makers."
      />
      <ul className="grid gap-4 xsmall:grid-cols-2 small:grid-cols-3">
        {SERVICES.map((s) => (
          <li key={s.id}>
            <LocalizedClientLink
              href={`/services#${s.id}`}
              className="group flex h-full flex-col rounded-2xl border border-grey-20 bg-white p-6 transition-colors hover:border-brand-500"
            >
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-semibold text-ink">
                  {s.title}
                </h3>
                {s.isNew && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-brand-700">
                    New
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-grey-60">{s.summary}</p>
              <span className="mt-4 text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                Learn more →
              </span>
            </LocalizedClientLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
