import { Metadata } from "next"

import { BRAND, whatsappLink } from "@lib/brand"
import ContactForm from "@modules/site/components/contact-form"
import PageHeader from "@modules/site/components/page-header"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: `Contact | ${BRAND.name}`,
  description: `Get in touch with ${BRAND.name} for 3D printing quotes, custom design and orders.`,
}

export default function ContactPage() {
  const channels = [
    {
      label: "WhatsApp",
      value: BRAND.contact.phoneDisplay,
      href: whatsappLink(),
      note: "Fastest: send files and photos here",
    },
    {
      label: "Email",
      value: BRAND.contact.email,
      href: `mailto:${BRAND.contact.email}`,
      note: "For drawings, POs and invoices",
    },
    {
      label: "Instagram",
      value: `@${BRAND.contact.instagram}`,
      href: `https://instagram.com/${BRAND.contact.instagram}`,
      note: "See what we are printing",
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your part"
        intro="Questions about a print, a bulk order or an existing order? Reach us any way you like. Include your order number if you have one."
      />

      <div className="content-container grid gap-10 py-16 small:grid-cols-[2fr_3fr]">
        <section className="grid content-start gap-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="rounded-2xl border border-grey-20 bg-white p-5 transition-colors hover:border-brand-500"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {c.label}
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                {c.value}
              </p>
              <p className="text-sm text-grey-60">{c.note}</p>
            </a>
          ))}
          <div className="rounded-2xl bg-grey-5 p-5 text-sm text-grey-60">
            <p className="font-semibold text-ink">{BRAND.city}</p>
            <p>{BRAND.hours}</p>
            <p className="mt-2">Pickup by appointment. Courier across India.</p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-semibold text-ink">
            Send an enquiry
          </h2>
          <ContactForm />
        </section>
      </div>
    </>
  )
}
