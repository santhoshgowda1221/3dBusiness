import { Metadata } from "next"

import { BRAND, whatsappLink } from "@lib/brand"
import CtaBand from "@modules/site/components/cta-band"
import PageHeader from "@modules/site/components/page-header"
import {
  primaryButton,
  secondaryButton,
} from "@modules/site/components/section-heading"

export const metadata: Metadata = {
  title: `Custom 3D design | ${BRAND.name}`,
  description:
    "No CAD file? Send a sketch, photo or measurements and we will model a print-ready part.",
}

const WHAT_TO_SEND = [
  "A sketch or drawing with the key dimensions",
  "Photos of the part, ideally next to a ruler",
  "The broken original, if you are replacing something",
  "What the part attaches to, and what load or heat it sees",
]

const DESIGN_STEPS = [
  {
    title: "Brief",
    body: "You send what you have. We ask a few questions about fit, load and looks, then quote the design work.",
  },
  {
    title: "Model",
    body: "We build the part in CAD, designed for printing: sensible wall thickness, no unprintable overhangs.",
  },
  {
    title: "Review",
    body: "You see renders and dimensions before anything is printed, with a round of changes included.",
  },
  {
    title: "Print and hand over",
    body: "We print the part and send you the STL, so you can reprint it any time.",
  },
]

export default function DesignPage() {
  return (
    <>
      <PageHeader
        eyebrow="Custom design"
        title="No 3D model? We will design it."
        intro="From a quick replacement clip to a full enclosure, we turn sketches, photos and measurements into print-ready parts."
      >
        <a
          href={whatsappLink(
            "Hi, I need a part designed. Here is what I have:"
          )}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryButton}
        >
          Start on WhatsApp
        </a>
        <a href={`mailto:${BRAND.contact.email}`} className={secondaryButton}>
          Email your brief
        </a>
      </PageHeader>

      <div className="content-container grid gap-12 py-16 small:grid-cols-2">
        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">
            What to send us
          </h2>
          <ul className="mt-5 grid gap-3">
            {WHAT_TO_SEND.map((item) => (
              <li key={item} className="flex gap-3 text-grey-70">
                <span aria-hidden className="text-brand-600">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-brand-50 p-5 text-sm text-grey-70">
            Design work is quoted per project, depending on complexity. We
            confirm the price before starting, and printing is quoted
            separately.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">
            How a design job runs
          </h2>
          <ol className="mt-5 grid gap-4">
            {DESIGN_STEPS.map((s, i) => (
              <li
                key={s.title}
                className="rounded-2xl border border-grey-20 bg-white p-5"
              >
                <span className="font-display text-sm font-semibold text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1 text-grey-60">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <CtaBand
        title="Already have a 3D file?"
        body="Skip the design step: upload your STL and get a price in seconds."
      />
    </>
  )
}
