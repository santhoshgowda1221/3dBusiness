import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  addToCartWorkflow,
  uploadFilesWorkflow,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { PRINT_MATERIALS } from "../../lib/print-pricing"
import {
  calculatePrintQuoteStep,
  CalculatePrintQuoteStepInput,
} from "./steps/calculate-print-quote"
import { validatePrintCartStep } from "./steps/validate-print-cart"

export type AddPrintToCartWorkflowInput = CalculatePrintQuoteStepInput & {
  cart_id: string
  file_name: string
}

// Re-prices the uploaded file on the server, stores it privately and adds the
// print plus its setup fee to the cart as custom-priced line items.
export const addPrintToCartWorkflow = createWorkflow(
  "add-print-to-cart",
  (input: AddPrintToCartWorkflowInput) => {
    const { geometry, quote } = calculatePrintQuoteStep(input)

    const { data: carts } = useQueryGraphStep({
      entity: "cart",
      fields: ["id", "currency_code", "completed_at"],
      filters: { id: input.cart_id },
      options: { throwIfKeyNotFound: true },
    })

    const cart = transform({ carts }, ({ carts }) => carts[0])
    validatePrintCartStep({ cart, quote })

    const uploadInput = transform({ input }, ({ input }) => ({
      files: [
        {
          filename: input.file_name,
          mimeType: "model/stl",
          content: input.file_base64,
          access: "private" as const,
        },
      ],
    }))
    const files = uploadFilesWorkflow.runAsStep({ input: uploadInput })

    const items = transform(
      { input, geometry, quote, files },
      ({ input, geometry, quote, files }) => {
        const print = {
          file_id: files[0].id,
          file_name: input.file_name,
          material: quote.material,
          infill_percent: quote.infill_percent,
          volume_cm3: quote.volume_cm3,
          weight_g: quote.weight_g,
          print_hours: quote.print_hours,
          bounding_box_mm: geometry.bounding_box_mm,
        }
        return [
          {
            title: `3D print: ${input.file_name}`,
            subtitle: `${PRINT_MATERIALS[quote.material].label}, ${quote.infill_percent}% infill`,
            quantity: quote.quantity,
            unit_price: quote.unit_price,
            requires_shipping: true,
            is_tax_inclusive: false,
            metadata: { print_kind: "part", print },
          },
          {
            title: `Setup fee: ${input.file_name}`,
            subtitle: "File check and slicing, once per design",
            quantity: 1,
            unit_price: quote.setup_fee,
            requires_shipping: false,
            is_tax_inclusive: false,
            metadata: { print_kind: "setup_fee", file_id: files[0].id },
          },
        ]
      }
    )

    addToCartWorkflow.runAsStep({
      input: { cart_id: input.cart_id, items },
    })

    return new WorkflowResponse({ quote })
  }
)
