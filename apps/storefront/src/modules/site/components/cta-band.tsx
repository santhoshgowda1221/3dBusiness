import { whatsappLink } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type CtaBandProps = {
  title?: string
  body?: string
}

export default function CtaBand({
  title = "Have a part in mind?",
  body = "Upload your STL for an instant price, or message us with a sketch or photo.",
}: CtaBandProps) {
  return (
    <section className="content-container pb-20">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink px-8 py-10 small:flex-row small:items-center small:px-12">
        <div>
          <h2 className="font-display text-3xl font-semibold text-white">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-grey-30">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <LocalizedClientLink
            href="/quote"
            className="inline-flex h-12 items-center rounded-full bg-brand-500 px-6 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Get an instant quote
          </LocalizedClientLink>
          <a
            href={whatsappLink("Hi, I'd like a quote for a 3D print.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full border border-grey-60 px-6 text-sm font-semibold text-white hover:border-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
