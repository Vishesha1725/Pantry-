"use client";

import { Check, Clock, PackagePlus, RefreshCw, ShoppingCart, Trash2, X } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Button } from "@/components/ui/button";
import { EditItemModal } from "@/components/edit-item-modal";
import { usePantryQuest } from "@/lib/app-state";
import type { GroceryItem, GrocerySectionKey } from "@/types";

export function GroceryItemCard({ item, sectionKey }: { item: GroceryItem; sectionKey: GrocerySectionKey }) {
  const { updateGroceryItem, deleteGroceryItem } = usePantryQuest();
  const updateStatus = (status: GroceryItem["status"], suggestedAction: string) => updateGroceryItem(sectionKey, item.name, { status, suggestedAction });
  return (
    <div className={`rounded-2xl border bg-white/75 p-4 shadow-insetCozy ${item.status === "have" ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-black capitalize text-cocoa">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.quantity.toFixed(item.quantity % 1 ? 2 : 0)} {item.unit} · used in {item.usedIn.join(", ")}</p>
        </div>
        <FreshnessBadge mode={item.buyingMode} />
      </div>
      <p className="mt-3 text-sm text-cocoa/80">{item.suggestedAction}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => updateStatus("have", "Already available at home")}><Check className="h-3.5 w-3.5" />I have this</Button>
        <Button size="sm" variant="outline" onClick={() => updateStatus("low", "Low quantity. Add a top-up.")}><PackagePlus className="h-3.5 w-3.5" />Low</Button>
        <Button size="sm" variant="outline" onClick={() => updateGroceryItem(sectionKey, item.name, { buyingMode: "same_day_fresh", status: "need", suggestedAction: "Order same-day before cooking" })}><Clock className="h-3.5 w-3.5" />Same-day</Button>
        <Button size="sm" variant="outline" onClick={() => updateStatus("stale", "Replace ingredient before cooking")}><RefreshCw className="h-3.5 w-3.5" />Replace</Button>
        <Button size="sm" variant="ghost" onClick={() => updateStatus("ignored", "Ignored for this grocery run")}><X className="h-3.5 w-3.5" />Ignore</Button>
        <Button size="sm" onClick={() => updateStatus("need", "Need to order")}><ShoppingCart className="h-3.5 w-3.5" />Need</Button>
        <EditItemModal
          title={`Edit ${item.name}`}
          fields={["name", "quantity", "unit", "category"]}
          values={{ name: item.name, quantity: item.quantity, unit: item.unit, category: item.category }}
          onSave={(values) => updateGroceryItem(sectionKey, item.name, {
            name: String(values.name),
            quantity: Number(values.quantity) || item.quantity,
            unit: String(values.unit),
            category: String(values.category)
          })}
        />
        <Button size="sm" variant="outline" onClick={() => deleteGroceryItem(sectionKey, item.name)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
      </div>
    </div>
  );
}
