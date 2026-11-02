import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { addPrintToCartWorkflow } from "../../../../../workflows/print-quote/add-print-to-cart"
import { PostPrintQuoteBody } from "../../../print-quotes/validators"

export async function POST(
  req: MedusaRequest<PostPrintQuoteBody>,
  res: MedusaResponse
) {
  const { file_name, file_base64, material, infill_percent, quantity } =
    req.validatedBody

  const { result } = await addPrintToCartWorkflow(req.scope).run({
    input: {
      cart_id: req.params.id,
      file_name,
      file_base64,
      material,
      infill_percent,
      quantity,
    },
  })

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const {
    data: [cart],
  } = await query.graph({
    entity: "cart",
    fields: ["id", "currency_code", "total", "items.*"],
    filters: { id: req.params.id },
  })

  res.json({ cart, quote: result.quote })
}
