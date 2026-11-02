import { STEPS } from "@modules/site/data"
import SectionHeading from "./section-heading"

export default function HowItWorks() {
  return (
    <section className="content-container py-20">
      <SectionHeading
        eyebrow="Simple process"
        title="How it works"
        intro="Three steps from file to finished part. You always see the price before anything is printed."
      />
      <ol className="grid gap-4 small:grid-cols-3">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-grey-20 bg-white p-6"
          >
            <span className="font-display text-sm font-semibold text-brand-600">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-display text-xl font-semibold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-grey-60">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
