import { MATERIALS, PrintMaterial } from "@lib/print-materials"

export type { PrintMaterial }

export const MATERIAL_OPTIONS: { value: PrintMaterial; label: string }[] =
  MATERIALS.map((m) => ({ value: m.key, label: m.label }))

export type PrintQuoteResponse = {
  file_name: string
  geometry: {
    triangle_count: number
    volume_mm3: number
    bounding_box_mm: { x: number; y: number; z: number }
  }
  quote: {
    currency_code: "inr"
    material: PrintMaterial
    infill_percent: number
    quantity: number
    volume_cm3: number
    weight_g: number
    print_hours: number
    material_cost: number
    machine_cost: number
    unit_price: number
    setup_fee: number
    total: number
    fits_build_volume: boolean
  }
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  // Chunked to avoid call stack limits on large files
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + 0x8000))
    )
  }
  return btoa(binary)
}

export type PrintRequest = {
  file: File
  material: PrintMaterial
  infill_percent: number
  quantity: number
}

// Called from the browser: the STL can be tens of MB, which is over the
// Next.js server action body limit, so it goes straight to the Medusa store API.
async function postPrint<T>(path: string, input: PrintRequest): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key":
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
    },
    body: JSON.stringify({
      file_name: input.file.name,
      file_base64: toBase64(await input.file.arrayBuffer()),
      material: input.material,
      infill_percent: input.infill_percent,
      quantity: input.quantity,
    }),
  })

  const body = await res.json()
  if (!res.ok) {
    throw new Error(body.message ?? "Something went wrong, please try again")
  }
  return body
}

export function requestPrintQuote(
  input: PrintRequest
): Promise<PrintQuoteResponse> {
  return postPrint("/store/print-quotes", input)
}

// The backend re-prices the file itself; the quote shown in the browser is
// never sent as a price.
export function addPrintToCart(
  cartId: string,
  input: PrintRequest
): Promise<{ quote: PrintQuoteResponse["quote"] }> {
  return postPrint(`/store/carts/${cartId}/print-items`, input)
}
