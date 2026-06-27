"use client";

import { Trash2 } from "lucide-react";
import { daysOfStockRemaining, daysUntil, isExpiringSoon, isLowStock } from "@/lib/freshness-engine";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditItemModal } from "@/components/edit-item-modal";
import { usePantryQuest } from "@/lib/app-state";
import type { PantryItem } from "@/types";

export function PantryItemCard({ item, editable = false }: { item: PantryItem; editable?: boolean }) {
  const { updatePantryItem, deletePantryItem } = usePantryQuest();
  const days = daysUntil(item.expiryDate);
  const remaining = daysOfStockRemaining(item);
  return (
    <div className="cozy-panel rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black capitalize text-cocoa">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.quantity} {item.unit} · {item.storageType}</p>
        </div>
        <FreshnessBadge mode={item.buyingMode} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{days === null ? "No expiry" : days < 0 ? "Expired" : days <= 3 ? "Use Soon" : "Fresh"}</Badge>
        {isLowStock(item) && <Badge className="bg-honey/40">Low Stock</Badge>}
        {isExpiringSoon(item) && <Badge className="bg-coral/20">Order Today</Badge>}
        {remaining !== null && <Badge>{remaining} days left</Badge>}
      </div>
      {editable && (
        <div className="mt-4 flex flex-wrap gap-2">
          <EditItemModal
            title={`Edit ${item.name}`}
            fields={["name", "category", "quantity", "unit", "expiryDate", "notes"]}
            values={{ name: item.name, category: item.category, quantity: item.quantity, unit: item.unit, expiryDate: item.expiryDate ?? "", notes: item.notes ?? "" }}
            onSave={(values) => updatePantryItem(item.id, {
              name: String(values.name),
              category: String(values.category),
              quantity: Number(values.quantity) || item.quantity,
              unit: String(values.unit),
              expiryDate: String(values.expiryDate) || undefined,
              notes: String(values.notes)
            })}
          />
          <Button size="sm" variant="outline" onClick={() => deletePantryItem(item.id)}><Trash2 className="h-3.5 w-3.5" />Delete</Button>
        </div>
      )}
    </div>
  );
}
