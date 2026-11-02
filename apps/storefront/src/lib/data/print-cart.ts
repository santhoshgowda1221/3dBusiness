"use server"

import { revalidateTag } from "next/cache"
import { getOrSetCart } from "./cart"
import { getCacheTag } from "./cookies"

/**
 * Returns the ID of the visitor's cart for the given country, creating it if
 * needed. The browser then uploads the STL straight to the Medusa backend,
 * because files can exceed the server action body size limit.
 */
export async function getPrintCartId(countryCode: string) {
  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  return cart.id
}

/**
 * Clears cached cart data after a print was added outside the regular
 * add-to-cart server action.
 */
export async function refreshCart() {
  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag, { expire: 0 })

  const fulfillmentCacheTag = await getCacheTag("fulfillment")
  revalidateTag(fulfillmentCacheTag, { expire: 0 })
}
