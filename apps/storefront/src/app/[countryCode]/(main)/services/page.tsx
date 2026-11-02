import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CtaBand from "@modules/site/components/cta-band"
import PageHeader from "@modules/site/components/page-header"
import { primaryButton } from "@modules/site/components/section-heading"
import { SERVICES } from "@modules/site/data"

export const metadata: Metadata = {
  title: `Services | ${BRAND.name}`,
  description: `3D printing services in ${BRAND.city}: prototyping, functional parts, small batches, drone parts and custom design.`,
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Everything from one prototype to a production run"
        intro="Tell us what the part has to do and we will recommend the material, settings and finish that get it there."
      >
        <LocalizedClientLink href="/quote" className={primaryButton}>
          Get an instant quote
        </LocalizedClientLink>
      </PageHeader>

      <div className="content-container divide-y divide-grey-20 py-8">
        {SERVICES.map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="grid scroll-mt-24 gap-6 py-12 small:grid-cols-[2fr_3fr]"
          >
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {s.title}
                </h2>
                {s.isNew && (
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold uppercase text-brand-700">
                    New
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-grey-50">Ideal for</p>
              <p className="font-medium text-ink">{s.idealFor}</p>
            </div>
            <div>
              <p className="text-lg text-grey-70">{s.summary}</p>
              <ul className="mt-5 grid gap-2">
                {s.details.map((d) => (
                  <li key={d} className="flex gap-3 text-grey-60">
                    <span aria-hidden className="text-brand-600">
                      ✓
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>

      <CtaBand />
    </>
  )
}
