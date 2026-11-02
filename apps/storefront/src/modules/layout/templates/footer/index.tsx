import { BRAND, NAV_LINKS, whatsappLink } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SERVICES } from "@modules/site/data"

const POLICY_LINKS = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
]

export default function Footer() {
  return (
    <footer className="border-t border-grey-20 bg-grey-5 w-full">
      <div className="content-container grid gap-10 py-16 xsmall:grid-cols-2 small:grid-cols-[2fr_1fr_1fr_1.5fr]">
        <div>
          <LocalizedClientLink
            href="/"
            className="font-display text-xl font-semibold text-ink"
          >
            {BRAND.name}
          </LocalizedClientLink>
          <p className="mt-3 max-w-xs text-sm text-grey-60">{BRAND.tagline}.</p>
          <LocalizedClientLink
            href="/quote"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get an instant quote
          </LocalizedClientLink>
        </div>

        <FooterColumn title="Explore">
          {NAV_LINKS.filter((l) => l.href !== "/").map((l) => (
            <li key={l.href}>
              <LocalizedClientLink href={l.href} className="hover:text-ink">
                {l.label}
              </LocalizedClientLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Services">
          {SERVICES.map((s) => (
            <li key={s.id}>
              <LocalizedClientLink
                href={`/services#${s.id}`}
                className="hover:text-ink"
              >
                {s.title}
              </LocalizedClientLink>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              WhatsApp {BRAND.contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={`mailto:${BRAND.contact.email}`} className="hover:text-ink">
              {BRAND.contact.email}
            </a>
          </li>
          <li>
            <a
              href={`https://instagram.com/${BRAND.contact.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-ink"
            >
              Instagram @{BRAND.contact.instagram}
            </a>
          </li>
          <li className="text-grey-50">
            {BRAND.city} · {BRAND.hours}
          </li>
        </FooterColumn>
      </div>

      <div className="border-t border-grey-20">
        <div className="content-container flex flex-col justify-between gap-3 py-6 text-xs text-grey-50 xsmall:flex-row">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-4">
            {POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <LocalizedClientLink href={l.href} className="hover:text-ink">
                  {l.label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
        {title}
      </p>
      <ul className="flex flex-col gap-2 text-sm text-grey-60">{children}</ul>
    </div>
  )
}
