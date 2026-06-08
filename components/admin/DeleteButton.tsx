"use client";

import { Icon } from "@/components/ui/Icon";

export function DeleteButton({ action, label = "Delete this item?" }: { action: () => Promise<void>; label?: string }) {
  return (
    <form action={action} onSubmit={(e) => { if (!confirm(label)) e.preventDefault(); }}>
      <button
        type="submit"
        className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-rose-50 hover:text-rose-600"
        aria-label="Delete"
      >
        <Icon name="trash" className="size-4" />
      </button>
    </form>
  );
}
