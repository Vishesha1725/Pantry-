import { Check, Clock, PackagePlus, RefreshCw, ShoppingCart, X } from "lucide-react";
import { FreshnessBadge } from "@/components/freshness-badge";
import { Button } from "@/components/ui/button";
import type { GroceryItem } from "@/types";

export function GroceryItemCard({ item }: { item: GroceryItem }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-insetCozy">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-black capitalize text-cocoa">{item.name}</h4>
          <p className="text-sm text-muted-foreground">{item.quantity.toFixed(item.quantity % 1 ? 2 : 0)} {item.unit} · used in {item.usedIn.join(", ")}</p>
        </div>
        <FreshnessBadge mode={item.buyingMode} />
      </div>
      <p className="mt-3 text-sm text-cocoa/80">{item.suggestedAction}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" variant="secondary"><Check className="h-3.5 w-3.5" />I have this</Button>
        <Button size="sm" variant="outline"><PackagePlus className="h-3.5 w-3.5" />Low</Button>
        <Button size="sm" variant="outline"><Clock className="h-3.5 w-3.5" />Same-day</Button>
        <Button size="sm" variant="outline"><RefreshCw className="h-3.5 w-3.5" />Replace</Button>
        <Button size="sm" variant="ghost"><X className="h-3.5 w-3.5" />Ignore</Button>
        <Button size="sm"><ShoppingCart className="h-3.5 w-3.5" />Need</Button>
      </div>
    </div>
  );
}
