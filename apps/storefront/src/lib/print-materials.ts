// Materials offered on the site and in the quote calculator. The keys must
// match PRINT_MATERIALS in apps/backend/src/lib/print-pricing.ts.
// Properties are typical values for each filament family, for guidance only.
export type PrintMaterial = "pla" | "petg" | "asa" | "tpu" | "pa-cf"

export type MaterialInfo = {
  key: PrintMaterial
  name: string
  label: string
  tier: "Standard" | "Durable" | "Outdoor" | "Flexible" | "Engineering"
  summary: string
  bestFor: string
  heatC: string
  strength: string
  densityGcm3: number
}

export const MATERIALS: MaterialInfo[] = [
  {
    key: "pla",
    name: "PLA",
    label: "PLA",
    tier: "Standard",
    summary:
      "Sharp detail and a clean surface finish at the lowest cost. Softens in hot cars and direct sun.",
    bestFor: "Prototypes, display models, desk accessories, gifts",
    heatC: "~55°C",
    strength: "Rigid, moderate",
    densityGcm3: 1.24,
  },
  {
    key: "petg",
    name: "PETG",
    label: "PETG",
    tier: "Durable",
    summary:
      "Tougher and more heat tolerant than PLA, with a little flex so parts bend before they break.",
    bestFor: "Functional parts, enclosures, brackets, clips",
    heatC: "~70°C",
    strength: "Tough, impact resistant",
    densityGcm3: 1.27,
  },
  {
    key: "asa",
    name: "ASA",
    label: "ASA (UV resistant)",
    tier: "Outdoor",
    summary:
      "Holds its colour and strength in sunlight and rain. Our pick for anything that lives outside.",
    bestFor: "Outdoor fittings, automotive parts, signage",
    heatC: "~95°C",
    strength: "Rigid, weatherproof",
    densityGcm3: 1.07,
  },
  {
    key: "tpu",
    name: "TPU",
    label: "TPU 95A (flexible)",
    tier: "Flexible",
    summary:
      "Rubber-like and nearly impossible to snap. Absorbs shock and grips surfaces.",
    bestFor: "Gaskets, bumpers, phone cases, drone guards",
    heatC: "~60°C",
    strength: "Flexible, abrasion resistant",
    densityGcm3: 1.21,
  },
  {
    key: "pa-cf",
    name: "PA-CF",
    label: "PA-CF (carbon fibre nylon)",
    tier: "Engineering",
    summary:
      "Nylon reinforced with chopped carbon fibre: stiff, light and heat resistant, with a matte finish.",
    bestFor: "Drone frames, motor mounts, jigs and fixtures",
    heatC: "~150°C",
    strength: "Very stiff, high strength",
    densityGcm3: 1.2,
  },
]
