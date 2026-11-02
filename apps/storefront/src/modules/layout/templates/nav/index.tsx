import { Suspense } from "react"

import { BRAND, NAV_LINKS } from "@lib/brand"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white/90 backdrop-blur border-grey-20">
        <nav className="content-container flex items-center justify-between gap-6 w-full h-full text-sm">
          <div className="flex items-center gap-3 h-full">
            {/* Slide-out menu on phones and tablets */}
            <div className="h-full small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2 font-display text-lg font-semibold text-ink"
              data-testid="nav-store-link"
            >
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white"
              >
                ▤
              </span>
              {BRAND.name}
            </LocalizedClientLink>
          </div>

          <ul className="hidden small:flex items-center gap-6 text-grey-60">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <LocalizedClientLink
                  href={link.href}
                  className="hover:text-ink transition-colors"
                >
                  {link.label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-x-5 h-full text-grey-60">
            <Search />
            <LocalizedClientLink
              className="hidden small:block hover:text-ink"
              href="/account"
              data-testid="nav-account-link"
            >
              Account
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ink flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
            <LocalizedClientLink
              href="/quote"
              className="hidden xsmall:inline-flex h-9 items-center rounded-full bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Get a quote
            </LocalizedClientLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
