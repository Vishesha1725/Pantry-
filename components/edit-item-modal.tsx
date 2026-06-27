"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "./ui/button";

export function EditItemModal({ title, fields, values, onSave, triggerLabel = "Edit" }: { title: string; fields: string[]; values: Record<string, string | number>; onSave: (values: Record<string, string | number>) => void; triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);
  return (
    <>
      <Button type="button" size="sm" variant="outline" onClick={() => { setDraft(values); setOpen(true); }}>{triggerLabel}</Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-cocoa/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border bg-cream p-5 shadow-cozy">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-cocoa">{title}</h2>
              <Button type="button" size="icon" variant="ghost" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="mt-5 grid gap-3">
              {fields.map((field) => (
                <label key={field} className="text-sm font-bold capitalize text-cocoa">
                  {field.replace(/([A-Z])/g, " $1")}
                  <input
                    className="mt-1 w-full rounded-xl border bg-white/75 p-2 font-normal outline-none focus:ring-2 focus:ring-sage"
                    value={draft[field] ?? ""}
                    onChange={(event) => setDraft((current) => ({ ...current, [field]: event.target.value }))}
                  />
                </label>
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => { onSave(draft); setOpen(false); }}><Save className="h-4 w-4" />Save</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
