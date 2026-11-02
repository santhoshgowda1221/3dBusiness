import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { calculateQuote, PrintMaterial } from "../../../lib/print-pricing"
import { parseStl } from "../../../lib/stl"

export type CalculatePrintQuoteStepInput = {
  file_base64: string
  material: PrintMaterial
  infill_percent: number
  quantity: number
}

export const calculatePrintQuoteStep = createStep(
  "calculate-print-quote",
  async (input: CalculatePrintQuoteStepInput) => {
    const geometry = parseStl(Buffer.from(input.file_base64, "base64"))

    const quote = calculateQuote({
      volume_mm3: geometry.volume_mm3,
      bounding_box_mm: geometry.bounding_box_mm,
      material: input.material,
      infill_percent: input.infill_percent,
      quantity: input.quantity,
    })

    return new StepResponse({ geometry, quote })
  }
)
