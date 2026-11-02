import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import CtaBand from "@modules/site/components/cta-band"
import PageHeader from "@modules/site/components/page-header"
import { PROJECTS, SERVICES } from "@modules/site/data"

export const metadata: Metadata = {
  title: `Projects | ${BRAND.name}`,
  description: `Recent 3D printing work from ${BRAND.name} in ${BRAND.city}.`,
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Work from our workshop"
        intro="Prototypes, functional parts and one-off builds we have printed for customers."
      />

      <div className="content-container py-16">
        {PROJECTS.length ? (
          <ul className="grid gap-6 xsmall:grid-cols-2 small:grid-cols-3">
            {PROJECTS.map((p) => (
              <li
                key={p.title}
                className="overflow-hidden rounded-2xl border border-grey-20 bg-white"
              >
                <div className="aspect-[4/3] bg-grey-10">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                    {p.category} · {p.material}
                  </p>
                  <h2 className="mt-1 font-display text-lg font-semibold text-ink">
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm text-grey-60">{p.summary}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-grey-30 bg-grey-5 p-10 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Project stories coming soon
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-grey-60">
              We are photographing our recent work. In the meantime, here is
              what we regularly print:
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {SERVICES.map((s) => (
                <li
                  key={s.id}
                  className="rounded-full border border-grey-30 bg-white px-4 py-1.5 text-sm text-ink"
                >
                  {s.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <CtaBand title="Want your project here?" />
    </>
  )
}
