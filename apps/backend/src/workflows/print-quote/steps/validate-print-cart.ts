import { createStep } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { PrintQuote } from "../../../lib/print-pricing"

export type ValidatePrintCartStepInput = {
  cart: { id: string; currency_code: string; completed_at?: string | Date | null }
  quote: PrintQuote
}

export const validatePrintCartStep = createStep(
  "validate-print-cart",
  async ({ cart, quote }: ValidatePrintCartStepInput) => {
    if (cart.completed_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "This cart has already been checked out"
      )
    }
    if (cart.currency_code !== quote.currency_code) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Custom prints are priced in ${quote.currency_code.toUpperCase()}, but this cart uses ${cart.currency_code.toUpperCase()}. Switch to the India store to order prints.`
      )
    }
    if (!quote.fits_build_volume) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "This part is larger than the build volume and needs a manual quote"
      )
    }
  }
)
