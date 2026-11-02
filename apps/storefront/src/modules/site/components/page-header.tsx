type PageHeaderProps = {
  eyebrow: string
  title: string
  intro: string
  children?: React.ReactNode
}

export default function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-b border-grey-20 bg-gradient-to-b from-brand-50 to-white">
      <div className="content-container py-14 small:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink small:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-grey-60">{intro}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  )
}
