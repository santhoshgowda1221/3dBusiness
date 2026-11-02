import { z } from "@medusajs/framework/zod"
import { PRINT_MATERIAL_KEYS } from "../../../lib/print-pricing"

export const PostPrintQuoteSchema = z.object({
  file_name: z.string().regex(/\.stl$/i, "Only .stl files are supported"),
  file_base64: z.string().min(1),
  material: z.enum(PRINT_MATERIAL_KEYS),
  infill_percent: z.number().int().min(10).max(100),
  quantity: z.number().int().min(1).max(500),
})

export type PostPrintQuoteBody = z.infer<typeof PostPrintQuoteSchema>
