import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import CtaBand from "@modules/site/components/cta-band"
import PageHeader from "@modules/site/components/page-header"

export const metadata: Metadata = {
  title: `About | ${BRAND.name}`,
  description: `${BRAND.name} is a 3D printing workshop in ${BRAND.city}.`,
}

// TODO: replace this with your own story: who you are, why you started, and
// what equipment you run.
const VALUES = [
  {
    title: "Settings matter",
    body: "Orientation, wall count and infill decide whether a part survives. We set them for what your part has to do, not a one-size profile.",
  },
  {
    title: "Clear prices",
    body: "The instant quote shows exactly how the price is built up. No surprises at checkout beyond GST and shipping.",
  },
  {
    title: "Honest advice",
    body: "If 3D printing is the wrong process for your part, or a cheaper material will do, we will tell you.",
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={`A 3D printing workshop in ${BRAND.city}`}
        intro={`${BRAND.name} prints parts for engineers, students, startups and makers across India: from quick prototypes to carbon fibre drone frames.`}
      />

      <div className="content-container grid gap-12 py-16 small:grid-cols-[3fr_2fr]">
        <section className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Our story
          </h2>
          <div className="mt-4 space-y-4 text-lg text-grey-70">
            <p>
              We started {BRAND.name} because getting a good 3D print in{" "}
              {BRAND.city} meant long waits, unclear prices, or parts printed
              with whatever settings were already loaded.
            </p>
            <p>
              Today we run a small fleet of FDM printers for everything from
              PLA prototypes to carbon fibre nylon parts, and we treat every
              order like an engineering job.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-semibold text-ink">
            How we work
          </h2>
          <ul className="mt-4 grid gap-4">
            {VALUES.map((v) => (
              <li
                key={v.title}
                className="rounded-2xl border border-grey-20 bg-white p-5"
              >
                <h3 className="font-display text-lg font-semibold text-ink">
                  {v.title}
                </h3>
                <p className="mt-1 text-grey-60">{v.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <CtaBand />
    </>
  )
}
