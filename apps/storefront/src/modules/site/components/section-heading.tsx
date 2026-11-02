import { clx } from "@modules/common/components/ui"

type SectionHeadingProps = {
  eyebrow: string
  title: string
  intro?: string
  align?: "left" | "center"
}

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={clx(
        "mb-10 max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink small:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-base text-grey-60">{intro}</p>}
    </div>
  )
}

// Shared button styles so every call to action looks the same
export const primaryButton =
  "inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-700"

export const secondaryButton =
  "inline-flex h-12 items-center justify-center rounded-full border border-grey-30 bg-white px-6 text-sm font-semibold text-ink transition-colors hover:border-ink"
