import { calculateQuote, MIN_PRICE_PER_PART, SETUP_FEE } from "../print-pricing"

const cube = (mm: number) => ({
  volume_mm3: mm ** 3,
  bounding_box_mm: { x: mm, y: mm, z: mm },
})

describe("calculateQuote", () => {
  it("charges more for PA-CF than PLA for the same part", () => {
    const base = { ...cube(50), infill_percent: 20, quantity: 1 }
    const pla = calculateQuote({ ...base, material: "pla" })
    const pacf = calculateQuote({ ...base, material: "pa-cf" })
    expect(pacf.unit_price).toBeGreaterThan(pla.unit_price)
  })

  it("applies the minimum part price and the setup fee once per order", () => {
    const q = calculateQuote({
      ...cube(5),
      material: "pla",
      infill_percent: 20,
      quantity: 3,
    })
    expect(q.unit_price).toBe(MIN_PRICE_PER_PART)
    expect(q.total).toBe(MIN_PRICE_PER_PART * 3 + SETUP_FEE)
  })

  it("lets a long part fit by rotating it", () => {
    const q = calculateQuote({
      volume_mm3: 1000,
      bounding_box_mm: { x: 10, y: 250, z: 10 },
      material: "petg",
      infill_percent: 20,
      quantity: 1,
    })
    expect(q.fits_build_volume).toBe(true)
  })

  it("flags parts larger than the build volume", () => {
    const q = calculateQuote({
      ...cube(300),
      material: "pla",
      infill_percent: 20,
      quantity: 1,
    })
    expect(q.fits_build_volume).toBe(false)
  })
})
