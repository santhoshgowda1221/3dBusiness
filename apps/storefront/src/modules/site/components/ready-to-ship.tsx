import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import SectionHeading from "./section-heading"

export default async function ReadyToShip({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 4, fields: "*variants.calculated_price" },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section className="content-container py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Ready to ship"
          title="From our workshop"
          intro="Useful prints we make regularly, ready to order."
        />
        <LocalizedClientLink
          href="/store"
          className="mb-10 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View all →
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-12 small:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
