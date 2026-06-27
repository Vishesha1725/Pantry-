import type { GroceryItem } from "@/types";
import { GroceryItemCard } from "./grocery-item-card";

export function GrocerySection({ title, items, accent = "bg-sage" }: { title: string; items: GroceryItem[]; accent?: string }) {
  return (
    <section className="cozy-panel rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${accent}`} />
        <h2 className="text-xl font-black text-cocoa">{title}</h2>
        <span className="ml-auto rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-cocoa">{items.length}</span>
      </div>
      <div className="grid gap-3">
        {items.length ? items.map((item) => <GroceryItemCard key={`${title}-${item.name}-${item.unit}`} item={item} />) : <p className="rounded-xl bg-white/60 p-4 text-sm text-muted-foreground">Nothing needed here right now.</p>}
      </div>
    </section>
  );
}
