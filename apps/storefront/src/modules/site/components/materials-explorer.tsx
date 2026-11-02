"use client"

import { useState } from "react"

import { MATERIALS } from "@lib/print-materials"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SectionHeading from "./section-heading"

export default function MaterialsExplorer() {
  const [selected, setSelected] = useState(MATERIALS[0].key)
  const m = MATERIALS.find((x) => x.key === selected) ?? MATERIALS[0]

  return (
    <section id="materials" className="bg-grey-5 py-20">
      <div className="content-container">
        <SectionHeading
          eyebrow="Materials"
          title="Pick the right filament"
          intro="Each material behaves differently. Choose one below to see where it shines."
        />

        <div
          role="tablist"
          aria-label="Materials"
          className="mb-6 flex flex-wrap gap-2"
        >
          {MATERIALS.map((x) => (
            <button
              key={x.key}
              role="tab"
              aria-selected={x.key === selected}
              onClick={() => setSelected(x.key)}
              className={clx(
                "h-10 rounded-full border px-5 text-sm font-semibold transition-colors",
                x.key === selected
                  ? "border-ink bg-ink text-white"
                  : "border-grey-30 bg-white text-ink hover:border-ink"
              )}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className="grid gap-8 rounded-3xl border border-grey-20 bg-white p-6 small:grid-cols-[3fr_2fr] small:p-10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              {m.tier}
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-ink">
              {m.label}
            </h3>
            <p className="mt-4 text-lg text-grey-60">{m.summary}</p>
            <p className="mt-6 text-sm text-grey-50">Best for</p>
            <p className="font-medium text-ink">{m.bestFor}</p>
            <LocalizedClientLink
              href={`/quote?material=${m.key}`}
              className="mt-8 inline-flex h-11 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Quote in {m.name}
            </LocalizedClientLink>
          </div>
          <dl className="grid grid-cols-1 gap-3 self-start">
            {[
              ["Heat resistance", m.heatC],
              ["Strength", m.strength],
              ["Density", `${m.densityGcm3} g/cm³`],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between rounded-xl bg-grey-5 px-4 py-3"
              >
                <dt className="text-sm text-grey-60">{k}</dt>
                <dd className="font-display font-semibold text-ink">{v}</dd>
              </div>
            ))}
            <p className="text-xs text-grey-50">
              Typical values for the material family, for guidance only.
            </p>
          </dl>
        </div>
      </div>
    </section>
  )
}
