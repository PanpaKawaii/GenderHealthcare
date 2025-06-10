import * as React from "react"

const Textarea = React.forwardRef(function Textarea(props, ref) {
  const { className = "", ...rest } = props

  return (
    <textarea
      ref={ref}
      className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${className}`}
      {...rest}
    />
  )
})

export { Textarea }
