import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  MAX_BUILD_MM,
  PRINT_MATERIALS,
} from "../../../lib/print-pricing"
import { createPrintQuoteWorkflow } from "../../../workflows/print-quote"
import { PostPrintQuoteBody } from "./validators"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    materials: Object.entries(PRINT_MATERIALS).map(([value, m]) => ({
      value,
      label: m.label,
    })),
    max_build_mm: MAX_BUILD_MM,
  })
}

export async function POST(
  req: MedusaRequest<PostPrintQuoteBody>,
  res: MedusaResponse
) {
  const { file_name, file_base64, material, infill_percent, quantity } =
    req.validatedBody

  const { result } = await createPrintQuoteWorkflow(req.scope).run({
    input: { file_base64, material, infill_percent, quantity },
  })

  res.json({ file_name, ...result })
}
