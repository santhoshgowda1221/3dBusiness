import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "styles/globals.css"

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-mode="light"
      className={`${sans.variable} ${display.variable}`}
    >
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body className="font-sans bg-white text-ink antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
