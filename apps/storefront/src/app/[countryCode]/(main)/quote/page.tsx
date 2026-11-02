import { Metadata } from "next"
import { Suspense } from "react"

import { BRAND } from "@lib/brand"
import QuoteTemplate from "@modules/quote/templates/quote-template"

export const metadata: Metadata = {
  title: `Instant 3D printing quote | ${BRAND.name}`,
  description: "Upload an STL file and get an instant price for 3D printing.",
}

export default function QuotePage() {
  return (
    // The template reads ?material= from the URL
    <Suspense>
      <QuoteTemplate />
    </Suspense>
  )
}
