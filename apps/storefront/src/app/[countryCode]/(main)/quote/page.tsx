import { Metadata } from "next"

import QuoteTemplate from "@modules/quote/templates/quote-template"

export const metadata: Metadata = {
  title: "Instant 3D printing quote",
  description: "Upload an STL file and get an instant price for 3D printing.",
}

export default function QuotePage() {
  return <QuoteTemplate />
}
