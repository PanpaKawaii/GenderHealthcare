"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

export function Calendar({
  className = "",
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className}`}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-gray-300 rounded text-gray-700 hover:bg-gray-100",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-400 rounded-md w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative focus-within:z-20 " +
          "[&:has([aria-selected].day-range-end)]:rounded-r-md " +
          "[&:has([aria-selected].day-outside)]:bg-teal-100/50 " +
          "[&:has([aria-selected])]:bg-teal-100 " +
          "first:[&:has([aria-selected])]:rounded-l-md " +
          "last:[&:has([aria-selected])]:rounded-r-md",
        day:
          "h-9 w-9 p-0 font-normal rounded hover:bg-gray-100 focus:outline-none aria-selected:bg-teal-600 aria-selected:text-white",
        day_range_end: "day-range-end",
        day_selected:
          "bg-teal-600 text-white hover:bg-teal-700 focus:bg-teal-700",
        day_today: "bg-teal-100 text-teal-800",
        day_outside:
          "text-gray-400 opacity-50 aria-selected:bg-teal-100/50 aria-selected:text-gray-400",
        day_disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        day_range_middle: "bg-teal-100 text-teal-800",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
