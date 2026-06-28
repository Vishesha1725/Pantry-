"use client";

import { Trash2 } from "lucide-react";
import { EditItemModal } from "./edit-item-modal";
import { Button } from "./ui/button";
import { usePantryQuest } from "@/lib/app-state";

export function SettingsPanel() {
  const { weeklyEssentials, updateWeeklyEssential, deleteWeeklyEssential } = usePantryQuest();
  return (
    <div className="cozy-panel rounded-2xl p-5">
      <h2 className="text-xl font-black text-cocoa">Weekly essentials</h2>
      <div className="mt-4 grid gap-3">
        {weeklyEssentials.map((item) => (
          <div key={item.name} className="rounded-xl bg-white/65 p-3 font-semibold text-cocoa">
            <div className="flex items-center justify-between gap-3">
              <span className="capitalize">{item.name}</span>
              <span className="text-sm text-muted-foreground">{item.quantity} {item.unit}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <EditItemModal
                title={`Edit ${item.name}`}
                fields={["name", "quantity", "unit", "category"]}
                values={{ name: item.name, quantity: item.quantity, unit: item.unit, category: item.category }}
                onSave={(values) => updateWeeklyEssential(item.name, {
                  name: String(values.name),
                  quantity: Number(values.quantity) || item.quantity,
                  unit: String(values.unit),
                  category: String(values.category)
                })}
              />
              <Button size="sm" variant="outline" onClick={() => deleteWeeklyEssential(item.name)}><Trash2 className="h-3.5 w-3.5" />Remove</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
