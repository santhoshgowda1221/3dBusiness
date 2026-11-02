import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Prints the storefront publishable API key so it can be copied into
// apps/storefront/.env.local on a new machine.
export default async function printPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["token", "title"],
    filters: { type: "publishable", revoked_at: null },
  })

  if (!keys.length) {
    logger.warn("No publishable key found. Run `npx medusa db:migrate` first.")
    return
  }

  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${keys[0].token}`)
}
