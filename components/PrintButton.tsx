"use client";

import { Icon } from "@/components/ui/Icon";

/** Triggers the browser's native print dialog (Save as PDF). No PDF library needed. */
export function PrintButton({
  label = "Download / print as PDF",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-[0.95rem] font-medium tracking-tight text-white transition-all duration-200 hover:bg-navy-deep ${className}`}
    >
      <Icon name="download" className="size-4" />
      {label}
    </button>
  );
}
