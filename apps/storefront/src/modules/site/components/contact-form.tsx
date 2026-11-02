"use client"

import { FormEvent, useState } from "react"

import { whatsappLink } from "@lib/brand"
import { MATERIALS } from "@lib/print-materials"

const fieldClass =
  "h-11 w-full rounded-xl border border-grey-30 bg-white px-4 text-sm focus:border-ink focus:outline-none"

// Builds a WhatsApp message from the form, so enquiries reach you without the
// site storing anything. Swap for a backend inbox later if needed.
export default function ContactForm() {
  const [name, setName] = useState("")
  const [type, setType] = useState("3D printing quote")
  const [material, setMaterial] = useState("Not sure")
  const [message, setMessage] = useState("")

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const text = [
      `Hi, I'm ${name}.`,
      `Enquiry: ${type}`,
      `Material: ${material}`,
      "",
      message,
    ].join("\n")
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer")
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-3xl border border-grey-20 bg-white p-6 small:p-8"
    >
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Your name
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
          autoComplete="name"
        />
      </label>
      <div className="grid gap-4 xsmall:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          What do you need?
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={fieldClass}
          >
            <option>3D printing quote</option>
            <option>Custom design</option>
            <option>Bulk or batch order</option>
            <option>College or lab order</option>
            <option>Something else</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-ink">
          Material
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className={fieldClass}
          >
            <option>Not sure</option>
            {MATERIALS.map((m) => (
              <option key={m.key}>{m.label}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-sm font-medium text-ink">
        Tell us about the part
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-grey-30 bg-white px-4 py-3 text-sm focus:border-ink focus:outline-none"
          placeholder="Size, quantity, deadline, and what the part has to do"
        />
      </label>
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-6 text-sm font-semibold text-white hover:bg-brand-700"
      >
        Send on WhatsApp
      </button>
      <p className="text-xs text-grey-50">
        Opens WhatsApp with your message ready to send. Attach files there.
      </p>
    </form>
  )
}
