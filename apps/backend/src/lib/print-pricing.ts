// Placeholder rates in INR. Replace with your real filament, machine and
// overhead costs before taking orders.
export const PRINT_MATERIALS = {
  pla: {
    label: "PLA",
    density_g_cm3: 1.24,
    price_per_gram: 1.8,
    print_rate_cm3_hr: 12,
    machine_rate_per_hr: 60,
  },
  petg: {
    label: "PETG",
    density_g_cm3: 1.27,
    price_per_gram: 2.2,
    print_rate_cm3_hr: 10,
    machine_rate_per_hr: 60,
  },
  "pa-cf": {
    label: "PA-CF (carbon fibre nylon)",
    density_g_cm3: 1.2,
    price_per_gram: 8,
    print_rate_cm3_hr: 6,
    // Hardened nozzle wear and filament drying
    machine_rate_per_hr: 120,
  },
} as const

export type PrintMaterial = keyof typeof PRINT_MATERIALS

export const PRINT_MATERIAL_KEYS = Object.keys(PRINT_MATERIALS) as [
  PrintMaterial,
  ...PrintMaterial[],
]

// Build volume of the largest printer (mm)
export const MAX_BUILD_MM = { x: 256, y: 256, z: 256 }
export const SETUP_FEE = 150
export const MIN_PRICE_PER_PART = 99
// Share of a part's volume taken by walls and top/bottom layers, which are
// printed solid regardless of infill
const SHELL_FRACTION = 0.3

export type QuoteInput = {
  volume_mm3: number
  bounding_box_mm: { x: number; y: number; z: number }
  material: PrintMaterial
  infill_percent: number
  quantity: number
}

export type PrintQuote = {
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

const round2 = (n: number) => Math.round(n * 100) / 100

export function fitsBuildVolume(box: QuoteInput["bounding_box_mm"]): boolean {
  // Allow the part to be rotated to fit
  const part = [box.x, box.y, box.z].sort((a, b) => a - b)
  const bed = [MAX_BUILD_MM.x, MAX_BUILD_MM.y, MAX_BUILD_MM.z].sort(
    (a, b) => a - b
  )
  return part.every((size, i) => size <= bed[i])
}

export function calculateQuote(input: QuoteInput): PrintQuote {
  const rates = PRINT_MATERIALS[input.material]
  const volumeCm3 = input.volume_mm3 / 1000
  const fill = SHELL_FRACTION + (1 - SHELL_FRACTION) * (input.infill_percent / 100)
  const printedCm3 = volumeCm3 * fill

  const weightG = printedCm3 * rates.density_g_cm3
  const printHours = printedCm3 / rates.print_rate_cm3_hr
  const materialCost = weightG * rates.price_per_gram
  const machineCost = printHours * rates.machine_rate_per_hr
  const unitPrice = Math.max(MIN_PRICE_PER_PART, materialCost + machineCost)

  return {
    currency_code: "inr",
    material: input.material,
    infill_percent: input.infill_percent,
    quantity: input.quantity,
    volume_cm3: round2(volumeCm3),
    weight_g: round2(weightG),
    print_hours: round2(printHours),
    material_cost: round2(materialCost),
    machine_cost: round2(machineCost),
    unit_price: Math.ceil(unitPrice),
    setup_fee: SETUP_FEE,
    total: Math.ceil(unitPrice) * input.quantity + SETUP_FEE,
    fits_build_volume: fitsBuildVolume(input.bounding_box_mm),
  }
}
