"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ChangeEvent, DragEvent, useEffect, useState } from "react"

import { getPrintCartId, refreshCart } from "@lib/data/print-cart"
import {
  Button,
  Heading,
  Label,
  Text,
  clx,
} from "@modules/common/components/ui"
import {
  addPrintToCart,
  MATERIAL_OPTIONS,
  PrintMaterial,
  PrintQuoteResponse,
  requestPrintQuote,
} from "@modules/quote/lib/request-quote"

// Prints are priced in INR and shipped from Bengaluru
const PRINT_COUNTRY = "in"

// three.js needs the browser (WebGL), so skip server rendering
const StlViewer = dynamic(
  () => import("@modules/quote/components/stl-viewer"),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
  }
)

const MAX_FILE_MB = 40

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export default function QuoteTemplate() {
  const [file, setFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null)
  const [material, setMaterial] = useState<PrintMaterial>("pla")
  const [infill, setInfill] = useState(20)
  const [quantity, setQuantity] = useState(1)
  const [result, setResult] = useState<PrintQuoteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [adding, setAdding] = useState(false)
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const canOrder = countryCode === PRINT_COUNTRY

  const onAddToCart = async () => {
    if (!file) {
      return
    }
    setAdding(true)
    setError(null)
    try {
      const cartId = await getPrintCartId(countryCode)
      await addPrintToCart(cartId, {
        file,
        material,
        infill_percent: infill,
        quantity,
      })
      await refreshCart()
      router.push(`/${countryCode}/cart`)
    } catch (e) {
      setError((e as Error).message)
      setAdding(false)
    }
  }

  const selectFile = async (f: File | undefined) => {
    setError(null)
    setResult(null)
    if (!f) {
      return
    }
    if (!f.name.toLowerCase().endsWith(".stl")) {
      setError("Please upload an .stl file.")
      return
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Files up to ${MAX_FILE_MB} MB are supported.`)
      return
    }
    setFile(f)
    setFileData(await f.arrayBuffer())
  }

  // Re-quote whenever the file or options change
  useEffect(() => {
    if (!file) {
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await requestPrintQuote({
          file,
          material,
          infill_percent: infill,
          quantity,
        })
        if (!cancelled) {
          setResult(res)
        }
      } catch (e) {
        if (!cancelled) {
          setResult(null)
          setError((e as Error).message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 300)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [file, material, infill, quantity])

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragging(false)
    selectFile(e.dataTransfer.files[0])
  }

  const q = result?.quote
  const box = result?.geometry.bounding_box_mm

  return (
    <div className="content-container py-6" data-testid="quote-container">
      <Heading level="h1" className="mb-2">
        Instant 3D printing quote
      </Heading>
      <Text className="mb-8 text-gray-600">
        Upload an STL file to see your part in 3D and get a price straight away.
        Units are read as millimetres.
      </Text>

      <div className="grid gap-8 small:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="stl-upload"
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={clx(
              "relative flex h-[420px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed",
              dragging ? "border-gray-900 bg-gray-50" : "border-gray-200"
            )}
            data-testid="stl-dropzone"
          >
            {fileData ? (
              <div className="absolute inset-0">
                <StlViewer data={fileData} />
              </div>
            ) : (
              <div className="text-center">
                <Text className="font-medium">Drop an STL file here</Text>
                <Text className="text-sm text-gray-500">
                  or click to choose one (up to {MAX_FILE_MB} MB)
                </Text>
              </div>
            )}
          </label>
          <input
            id="stl-upload"
            type="file"
            accept=".stl"
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              selectFile(e.target.files?.[0])
            }
            data-testid="stl-input"
          />
          {file && (
            <div className="flex items-center justify-between text-sm">
              <span className="truncate text-gray-600">
                {file.name}
                {box &&
                  ` (${box.x.toFixed(1)} x ${box.y.toFixed(
                    1
                  )} x ${box.z.toFixed(1)} mm)`}
              </span>
              <Button
                variant="transparent"
                size="small"
                onClick={() => document.getElementById("stl-upload")?.click()}
              >
                Replace file
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="material">Material</Label>
            <select
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value as PrintMaterial)}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm"
            >
              {MATERIAL_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="infill">Infill: {infill}%</Label>
            <input
              id="infill"
              type="range"
              min={10}
              max={100}
              step={5}
              value={infill}
              onChange={(e) => setInfill(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="quantity">Quantity</Label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(500, Math.max(1, Number(e.target.value) || 1))
                )
              }
              className="h-10 w-28 rounded-md border border-gray-200 bg-white px-3 text-sm"
            />
          </div>

          <div
            className="rounded-lg border border-gray-200 p-5"
            data-testid="quote-summary"
          >
            {error && <Text className="text-red-600">{error}</Text>}
            {!error && !q && (
              <Text className="text-gray-500">
                {loading ? "Calculating..." : "Your quote will appear here."}
              </Text>
            )}
            {!error && q && (
              <div
                className={clx("flex flex-col gap-2", loading && "opacity-50")}
              >
                {!q.fits_build_volume && (
                  <Text className="mb-2 rounded bg-amber-50 p-2 text-sm text-amber-800">
                    This part is larger than our 256 mm build volume. Contact us
                    to quote it as a split print.
                  </Text>
                )}
                <Row label="Part volume" value={`${q.volume_cm3} cm³`} />
                <Row label="Estimated weight" value={`${q.weight_g} g`} />
                <Row
                  label="Estimated print time"
                  value={`${q.print_hours} h`}
                />
                <Row label="Price per part" value={inr.format(q.unit_price)} />
                <Row
                  label="Setup fee (per design)"
                  value={inr.format(q.setup_fee)}
                />
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold">
                  <span>Total ({q.quantity} pcs)</span>
                  <span data-testid="quote-total">{inr.format(q.total)}</span>
                </div>
                <Text className="text-xs text-gray-500">
                  Excludes GST and shipping.
                </Text>
              </div>
            )}
          </div>

          {canOrder ? (
            <Button
              size="large"
              onClick={onAddToCart}
              isLoading={adding}
              disabled={!q || loading || !q.fits_build_volume}
              data-testid="add-print-to-cart"
            >
              Add to cart
            </Button>
          ) : (
            <Text className="text-sm text-gray-600">
              Custom prints are made in Bengaluru and delivered within India.{" "}
              <Link href={`/${PRINT_COUNTRY}/quote`} className="underline">
                Switch to the India store
              </Link>{" "}
              to order.
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span>{value}</span>
    </div>
  )
}
