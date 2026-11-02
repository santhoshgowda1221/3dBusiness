import { FAQS } from "@modules/site/data"
import SectionHeading from "./section-heading"

export default function Faq() {
  return (
    <section className="content-container py-20">
      <div className="grid gap-10 small:grid-cols-[2fr_3fr]">
        <SectionHeading
          eyebrow="Questions"
          title="Common questions"
          intro="Anything else? Message us and we usually reply the same day."
        />
        <div className="divide-y divide-grey-20 border-y border-grey-20">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink">
                {f.q}
                <span
                  aria-hidden
                  className="text-2xl text-grey-40 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 text-grey-60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
