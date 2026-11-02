// Editable site content. Wording here is a starting point: adjust it to match
// how you actually work before launch.

export const STATS = [
  { value: "5", label: "materials", detail: "PLA to carbon fibre nylon" },
  { value: "Instant", label: "online quote", detail: "Upload an STL, see the price" },
  { value: "256 mm", label: "build size", detail: "Larger parts split and joined" },
  { value: "Pan-India", label: "delivery", detail: "Courier from Bengaluru" },
]

export const STEPS = [
  {
    title: "Upload or describe",
    body: "Drop an STL into the instant quote tool, or message us a sketch, photo or idea. No CAD file? We can design it.",
  },
  {
    title: "We review and slice",
    body: "We check wall thickness, orientation and supports, choose the right settings for your material, and confirm before printing.",
  },
  {
    title: "Printed, checked, shipped",
    body: "Each part is inspected, cleaned up and packed. Collect in Bengaluru or get it couriered anywhere in India.",
  },
]

export type Service = {
  id: string
  title: string
  summary: string
  details: string[]
  idealFor: string
  isNew?: boolean
}

export const SERVICES: Service[] = [
  {
    id: "prototyping",
    title: "Rapid prototyping",
    summary:
      "Go from CAD to a part in your hand in days, so you can test fit and form before committing to tooling.",
    details: [
      "Fast turnaround for design iterations",
      "Advice on tolerances, clearances and orientation",
      "PLA for form checks, PETG or PA-CF for functional tests",
    ],
    idealFor: "Product designers, startups, engineering students",
  },
  {
    id: "functional-parts",
    title: "Functional parts",
    summary:
      "End-use brackets, enclosures, jigs and replacement parts in materials chosen for strength, heat and weather.",
    details: [
      "Material picked for the load, temperature and environment",
      "Higher wall counts and infill where it matters",
      "Threaded inserts and post-processing on request",
    ],
    idealFor: "Workshops, labs, maintenance teams, hobbyists",
  },
  {
    id: "batch-production",
    title: "Small-batch production",
    summary:
      "Tens to hundreds of identical parts without the cost of a mould, with consistent settings across the batch.",
    details: [
      "Repeatable settings for every part in a run",
      "Per-part price drops as quantity grows",
      "Staggered deliveries for larger orders",
    ],
    idealFor: "Hardware startups, product sellers, event merchandise",
  },
  {
    id: "drone-uav",
    title: "Drone and UAV parts",
    summary:
      "Stiff, light carbon fibre nylon frames, motor mounts, camera cages and TPU guards for FPV and research drones.",
    details: [
      "PA-CF for frames and arms, TPU for bumpers and mounts",
      "Printed to your CAD or adapted from open designs",
      "Quick reprints when a crash takes out a part",
    ],
    idealFor: "FPV pilots, aerospace startups, college drone teams",
    isNew: true,
  },
  {
    id: "education",
    title: "Colleges and student projects",
    summary:
      "Prototyping support for final-year projects, competitions and research labs, including carbon fibre parts.",
    details: [
      "Help turning a project idea into a printable design",
      "Pricing for lab and department orders",
      "Fast reprints before demo day",
    ],
    idealFor: "Engineering colleges, student teams, research groups",
  },
  {
    id: "custom-design",
    title: "Custom 3D design",
    summary:
      "No CAD file? Send a sketch, photo or measurements and we model a print-ready part for you.",
    details: [
      "Modelling from sketches, photos or a broken original",
      "Design for printing: no unprintable overhangs",
      "You receive the STL as well as the part",
    ],
    idealFor: "Anyone with an idea but no 3D model",
  },
]

export const FAQS = [
  {
    q: "What file formats do you accept?",
    a: "The instant quote tool takes STL files. For STEP, OBJ, 3MF or a drawing, send it on WhatsApp or email and we will quote it manually.",
  },
  {
    q: "How is the price calculated?",
    a: "From the actual volume of your part, the material, the infill you choose and the machine time it needs, plus a one-time setup fee per design. The instant quote shows the full breakdown before you order.",
  },
  {
    q: "Which material should I choose?",
    a: "PLA for looks and prototypes, PETG for tougher everyday parts, ASA for anything outdoors, TPU when it needs to flex, and PA-CF for stiff, light engineering parts. Not sure? Ask us and we will recommend one.",
  },
  {
    q: "How big can a part be?",
    a: "Up to 256 × 256 × 256 mm in one piece. Larger parts can be split into sections and joined; contact us for a quote.",
  },
  {
    q: "How long does it take?",
    a: "Most orders are printed within a few working days, plus courier time. Large batches and engineering materials take longer. Ask if you have a deadline.",
  },
  {
    q: "Do prices include GST and shipping?",
    a: "The quote shows the price before GST and shipping. Both are added at checkout, and you see the full total before paying.",
  },
]

export type Review = { name: string; text: string; date: string; rating: number }

// Add real customer reviews here (with their permission). The reviews section
// on the homepage stays hidden while this list is empty.
export const REVIEWS: Review[] = []

export type Project = {
  title: string
  category: string
  material: string
  summary: string
  image?: string
}

// Add photos and short write-ups of your own work here. The projects page
// shows a "coming soon" message while this list is empty.
export const PROJECTS: Project[] = []
