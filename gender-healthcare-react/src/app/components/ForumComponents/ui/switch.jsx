"use client"

import { useState } from "react"

export function Switch({ className = "", defaultChecked = false, onChange }) {
  const [checked, setChecked] = useState(defaultChecked)

  const toggle = () => {
    const newState = !checked
    setChecked(newState)
    onChange?.(newState)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-300"
      } ${className}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  )
}
