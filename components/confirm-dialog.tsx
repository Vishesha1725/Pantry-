"use client";

import { Button } from "./ui/button";

export function ConfirmDialog({ title, description, onConfirm, children }: { title: string; description: string; onConfirm: () => void; children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        if (window.confirm(`${title}\n\n${description}`)) onConfirm();
      }}
    >
      {children}
    </Button>
  );
}
