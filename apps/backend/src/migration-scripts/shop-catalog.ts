import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"

// Replaces the starter's demo clothing with a starter range of 3D-printed
// products priced in INR. Runs after region-india (scripts run in name order).
// Edit names, prices and photos in the admin afterwards.

const DEMO_CATEGORIES = ["Shirts", "Sweatshirts", "Pants", "Merch"]
const COLOURS = ["Black", "White", "Orange"]

type CatalogItem = {
  title: string
  handle: string
  category: string
  description: string
  price: number
  weight: number
  colours: string[]
}

const CATALOG: CatalogItem[] = [
  {
    title: "Adjustable Phone and Tablet Stand",
    handle: "adjustable-phone-stand",
    category: "Desk and Home",
    description:
      "A folding stand with three viewing angles for phones and tablets up to 11 inches. Printed in PLA with a cable slot for charging.",
    price: 349,
    weight: 120,
    colours: COLOURS,
  },
  {
    title: "Cable Organiser Clips (Set of 6)",
    handle: "cable-organiser-clips",
    category: "Desk and Home",
    description:
      "Adhesive-backed clips that keep charging and USB cables in place on desks and bedside tables. Printed in flexible-tough PETG.",
    price: 199,
    weight: 40,
    colours: COLOURS,
  },
  {
    title: "Under-Desk Headphone Hook",
    handle: "under-desk-headphone-hook",
    category: "Desk and Home",
    description:
      "Clamps to desks up to 35 mm thick, no screws needed. Holds over-ear headphones out of the way. Printed in PETG.",
    price: 299,
    weight: 90,
    colours: ["Black", "White"],
  },
  {
    title: "Self-Watering Planter",
    handle: "self-watering-planter",
    category: "Desk and Home",
    description:
      "A two-part planter with a water reservoir and wick, for herbs and small indoor plants. 12 cm diameter, printed in PLA.",
    price: 449,
    weight: 180,
    colours: ["White", "Orange"],
  },
  {
    title: "Raspberry Pi 5 Case",
    handle: "raspberry-pi-5-case",
    category: "Tech Accessories",
    description:
      "A vented snap-fit case with openings for every port and a mount for the official active cooler. Printed in PETG.",
    price: 549,
    weight: 110,
    colours: ["Black", "White"],
  },
  {
    title: "5-inch FPV Drone Frame",
    handle: "5-inch-fpv-drone-frame",
    category: "Drone Parts",
    description:
      "A stiff, lightweight 5-inch freestyle frame printed in carbon fibre nylon (PA-CF), with 30.5 mm and 20 mm stack mounts. Hardware not included.",
    price: 2499,
    weight: 95,
    colours: ["Black"],
  },
]

export default async function shopCatalog({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: CATALOG.map((c) => c.handle) },
  })
  if (existing.length) {
    logger.info("Print catalog already exists, skipping.")
    return
  }

  // Hide the starter's demo clothing instead of deleting it
  const { data: demoProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { status: ProductStatus.PUBLISHED },
  })
  if (demoProducts.length) {
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: demoProducts.map((p) => p.id) },
        update: { status: ProductStatus.DRAFT },
      },
    })
  }

  const { data: demoCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
    filters: { name: DEMO_CATEGORIES },
  })
  if (demoCategories.length) {
    await updateProductCategoriesWorkflow(container).run({
      input: {
        selector: { id: demoCategories.map((c) => c.id) },
        update: { is_active: false },
      },
    })
  }

  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [...new Set(CATALOG.map((c) => c.category))].map(
        (name) => ({ name, is_active: true })
      ),
    },
  })

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["default_sales_channel_id"],
  })
  const salesChannelId = stores[0]?.default_sales_channel_id
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })

  await createProductsWorkflow(container).run({
    input: {
      products: CATALOG.map((item) => ({
        title: item.title,
        handle: item.handle,
        description: item.description,
        status: ProductStatus.PUBLISHED,
        weight: item.weight,
        category_ids: [categories.find((c) => c.name === item.category)!.id],
        shipping_profile_id: shippingProfiles[0].id,
        sales_channels: salesChannelId ? [{ id: salesChannelId }] : [],
        options: [
          { title: "Colour", values: item.colours, is_exclusive: true },
        ],
        variants: item.colours.map((colour) => ({
          title: colour,
          sku: `${item.handle}-${colour}`.toUpperCase(),
          options: { Colour: colour },
          // Printed to order, so no stock to track
          manage_inventory: false,
          prices: [{ amount: item.price, currency_code: "inr" }],
        })),
      })),
    },
  })

  logger.info(
    `Hid ${demoProducts.length} demo products and added ${CATALOG.length} print products.`
  )
}
