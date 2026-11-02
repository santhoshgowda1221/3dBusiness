// Everything that identifies the business lives here, so renaming the shop or
// adding real contact details is a one-file change.
// TODO: replace the placeholder name and contact details before launch.
export const BRAND = {
  name: "Layerline 3D",
  tagline: "3D printing and rapid prototyping in Bengaluru",
  city: "Bengaluru",
  description:
    "Precise FDM 3D printing for engineers, students, startups and makers. Upload an STL for an instant price, or tell us what you need and we will design it.",
  contact: {
    // Digits only, with country code, for wa.me links
    whatsapp: "910000000000",
    phoneDisplay: "+91 00000 00000",
    email: "hello@example.com",
    instagram: "your.handle",
  },
  hours: "Mon to Sat, 10am to 7pm",
  buildVolumeMm: 256,
}

export const whatsappLink = (message?: string) =>
  `https://wa.me/${BRAND.contact.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Shop", href: "/store" },
  { label: "Design", href: "/design" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]
