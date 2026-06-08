import type { ReactNode } from "react";

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-ink shadow-sm outline-none transition-colors focus:border-teal focus:ring-2 focus:ring-teal/25";

export function Input({ label, name, defaultValue, type = "text", required, placeholder, hint }: {
  label: string; name: string; defaultValue?: string | number; type?: string; required?: boolean; placeholder?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <input name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} className={inputCls} />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Textarea({ label, name, defaultValue, rows = 6, required, hint, mono }: {
  label: string; name: string; defaultValue?: string; rows?: number; required?: boolean; hint?: string; mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}{required && <span className="text-rose-500"> *</span>}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} required={required}
        className={`${inputCls} ${mono ? "font-mono text-xs leading-relaxed" : ""}`} />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Select({ label, name, defaultValue, options }: {
  label: string; name: string; defaultValue?: string; options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-navy">{label}</span>
      <select name={name} defaultValue={defaultValue} className={`${inputCls} capitalize`}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2.5">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-4 rounded border-line text-teal focus:ring-teal/30" />
      <span className="text-sm font-medium text-navy">{label}</span>
    </label>
  );
}

export function FormActions({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3 border-t border-line pt-5">{children}</div>;
}
