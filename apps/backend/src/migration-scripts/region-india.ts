import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { DEFAULT_REGION_STORE_POLICIES } from "../lib/region-store-policies"

// Adds an India region (INR, 18% GST) shipping from the Bengaluru workshop.
// Runs after initial-data-seed because migration scripts run in name order.
export default async function regionIndia({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  const { data: existing } = await query.graph({
    entity: "region",
    fields: ["id"],
    filters: { currency_code: "inr" },
  })
  if (existing.length) {
    logger.info("India region already exists, skipping.")
    return
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "default_sales_channel_id", "supported_currencies.*"],
  })
  const store = stores[0]
  if (!store) {
    logger.warn("No store found, skipping India region.")
    return
  }

  const currencies = (store.supported_currencies ?? []).map((c) => ({
    currency_code: c!.currency_code,
    is_default: c!.is_default,
  }))
  if (!currencies.some((c) => c.currency_code === "inr")) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            ...currencies,
            { currency_code: "inr", is_default: false },
          ],
        },
      },
    })
  }

  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          payment_providers: ["pp_system_default"],
          metadata: DEFAULT_REGION_STORE_POLICIES,
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "in",
        provider_id: "tp_system",
        default_tax_rate: { rate: 18, code: "GST", name: "GST" },
      },
    ],
  })

  const {
    result: [workshop],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Bengaluru Workshop",
          address: { city: "Bengaluru", country_code: "IN", address_1: "" },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: workshop.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Bengaluru Workshop delivery",
    type: "shipping",
    service_zones: [
      { name: "India", geo_zones: [{ country_code: "in", type: "country" }] },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: workshop.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })

  const shippingRules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ]

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Courier",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Standard",
          description: "Delivered in 4-6 days after printing.",
          code: "standard-in",
        },
        prices: [
          { currency_code: "inr", amount: 99 },
          { region_id: region.id, amount: 99 },
        ],
        rules: shippingRules,
      },
      {
        name: "Express Courier",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Express",
          description: "Delivered in 1-2 days after printing.",
          code: "express-in",
        },
        prices: [
          { currency_code: "inr", amount: 199 },
          { region_id: region.id, amount: 199 },
        ],
        rules: shippingRules,
      },
    ],
  })

  if (store.default_sales_channel_id) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: workshop.id, add: [store.default_sales_channel_id] },
    })
  }

  logger.info("Created India region with INR pricing and GST.")
}
