import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { STATS } from "@modules/site/data"
import { primaryButton, secondaryButton } from "./section-heading"

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-grey-20 bg-gradient-to-b from-brand-50 via-white to-white">
      {/* Faint layer lines, a nod to how FDM parts are built */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:repeating-linear-gradient(0deg,transparent,transparent_11px,#fed7aa_11px,#fed7aa_12px)] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
      />
      <div className="content-container relative py-16 small:py-24">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
          3D printing · {BRAND.city} · Pan-India
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink xsmall:text-5xl small:text-6xl">
          Your idea, printed layer by layer.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-grey-60">
          {BRAND.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LocalizedClientLink href="/quote" className={primaryButton}>
            Get an instant quote
          </LocalizedClientLink>
          <LocalizedClientLink href="/store" className={secondaryButton}>
            Browse the shop
          </LocalizedClientLink>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-3 small:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-grey-20 bg-white/80 p-5 backdrop-blur"
            >
              <dt className="text-xs font-medium uppercase tracking-wide text-grey-50">
                {s.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                {s.value}
              </dd>
              <dd className="mt-1 text-sm text-grey-60">{s.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
