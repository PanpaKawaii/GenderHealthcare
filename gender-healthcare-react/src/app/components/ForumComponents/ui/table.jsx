import React from "react"

export const Table = React.forwardRef((props, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm ${props.className || ""}`}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

export const TableHeader = React.forwardRef((props, ref) => (
  <thead
    ref={ref}
    className={`[&_tr]:border-b ${props.className || ""}`}
    {...props}
  />
))
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef((props, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${props.className || ""}`}
    {...props}
  />
))
TableBody.displayName = "TableBody"

export const TableFooter = React.forwardRef((props, ref) => (
  <tfoot
    ref={ref}
    className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${props.className || ""}`}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

export const TableRow = React.forwardRef((props, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${props.className || ""}`}
    {...props}
  />
))
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef((props, ref) => (
  <th
    ref={ref}
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${props.className || ""}`}
    {...props}
  />
))
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef((props, ref) => (
  <td
    ref={ref}
    className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${props.className || ""}`}
    {...props}
  />
))
TableCell.displayName = "TableCell"

export const TableCaption = React.forwardRef((props, ref) => (
  <caption
    ref={ref}
    className={`mt-4 text-sm text-muted-foreground ${props.className || ""}`}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"
