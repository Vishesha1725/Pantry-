import { daysOfStockRemaining, daysUntil, isExpiringSoon, isLowStock } from "@/lib/freshness-engine";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Badge } from "@/components/ui/badge";
import type { PantryItem } from "@/types";

export function PantryItemCard({ item }: { item: PantryItem }) {
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
    </div>
  );
}
